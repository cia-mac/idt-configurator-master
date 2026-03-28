/**
 * IDT Configurator — Constraint Validation Test Suite
 *
 * Pure-function reimplementations of the constraint logic from App.jsx,
 * tested against catalog.json as the single source of truth.
 *
 * Runner: Node.js built-in test runner (node:test)
 * Run:    node --test tests/constraints.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'src', 'data', 'catalog.json'), 'utf-8')
);

// ── Catalog lookups ─────────────────────────────────────────────────────────

const families = catalog.camera_families;          // [{id, group, hybrid?, ...}]
const processors = catalog.processors;             // [{id, hubSupport?, ...}]
const connections = catalog.connections;            // [{id, group, ...}]
const compatibility = catalog.compatibility;       // {procId: [connId, ...]}
const restrictions = catalog.restrictions;         // {familyId: {blockedProcessors, reason}}
const fpsDropRules = catalog.fpsDropRules;

const familyById = (id) => families.find(f => f.id === id);
const procById   = (id) => processors.find(p => p.id === id);
const connById   = (id) => connections.find(c => c.id === id);

// ── Reimplemented constraint functions (match App.jsx) ──────────────────────

function effectiveGroup(familyId, hybridMode) {
  const fam = familyById(familyId);
  if (!fam) return null;
  if (fam.hybrid && hybridMode === 'ethernet') return 'ccm';
  return fam.group;
}

function connsForProc(procId) {
  return compatibility[procId] || [];
}

function connsForFamily(familyId, hybridMode) {
  const group = effectiveGroup(familyId, hybridMode);
  return group
    ? connections.filter(c => c.group === group).map(c => c.id)
    : [];
}

function isProcessorBlocked(procId, familyId) {
  if (!familyId) return false;
  const rule = restrictions?.[familyId];
  return rule ? rule.blockedProcessors.includes(procId) : false;
}

function needsXSLinkHub(familyId, procId, hybridMode) {
  if (!familyId || !procId) return false;
  const fam = familyById(familyId);
  const proc = procById(procId);
  if (!fam || !proc) return false;
  if (fam.hybrid && hybridMode === 'ethernet') return false;
  return fam.group === 'compact' && !!proc.hubSupport;
}

/** True when the camera family can pair with the processor (ignoring restrictions). */
function canPair(familyId, procId, hybridMode) {
  const famConns = connsForFamily(familyId, hybridMode);
  const procConns = connsForProc(procId);
  return famConns.some(c => procConns.includes(c));
}

function fpsDropWarning(familyId, procId) {
  return (
    fpsDropRules.affectedFamilies.includes(familyId) &&
    fpsDropRules.singleChannelProcessors.includes(procId)
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const fiberFamilyIds   = families.filter(f => f.group === 'fiber').map(f => f.id);
const compactFamilyIds = families.filter(f => f.group === 'compact').map(f => f.id);
const ccmFamilyIds     = families.filter(f => f.group === 'ccm').map(f => f.id);
const hybridFamilyIds  = families.filter(f => f.hybrid).map(f => f.id);

const fiberProcIds   = processors.filter(p => connsForProc(p.id).includes('xstream-fiber')).map(p => p.id);
const usbcProcIds    = processors.filter(p => connsForProc(p.id).includes('xstream-usbc')).map(p => p.id);
const ethernetProcIds = processors.filter(p => connsForProc(p.id).includes('ethernet')).map(p => p.id);

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Catalog integrity', () => {
  it('has 7 processors', () => {
    assert.equal(processors.length, 7);
  });
  it('has 13 camera families', () => {
    assert.equal(families.length, 13);
  });
  it('has 3 connection types', () => {
    assert.equal(connections.length, 3);
  });
  it('compatibility map covers every processor', () => {
    for (const p of processors) {
      assert.ok(Array.isArray(compatibility[p.id]), `missing compatibility for ${p.id}`);
    }
  });
});

// ─── (a) Compatibility matrix ───────────────────────────────────────────────

describe('Compatibility matrix — fiber cameras', () => {
  for (const famId of fiberFamilyIds) {
    it(`${famId} pairs with all fiber-capable processors`, () => {
      for (const pid of fiberProcIds) {
        assert.ok(canPair(famId, pid, 'streaming'), `${famId} should pair with ${pid}`);
      }
    });
    it(`${famId} does NOT pair with tb3 (usbc-only) directly`, () => {
      // Fiber cameras have no xstream-usbc connection, so they can't go to tb3
      const famConns = connsForFamily(famId, 'streaming');
      const tb3Conns = connsForProc('tb3');
      const overlap = famConns.filter(c => tb3Conns.includes(c));
      assert.equal(overlap.length, 0, `${famId} should not directly pair with tb3`);
    });
    it(`${famId} does NOT pair with viper`, () => {
      assert.ok(!canPair(famId, 'viper', 'streaming'), `${famId} should not pair with viper`);
    });
  }
});

describe('Compatibility matrix — compact (USB-C) cameras', () => {
  for (const famId of compactFamilyIds) {
    it(`${famId} pairs with all usbc-capable processors`, () => {
      for (const pid of usbcProcIds) {
        assert.ok(canPair(famId, pid, 'streaming'), `${famId} should pair with ${pid}`);
      }
    });
    it(`${famId} does NOT pair with viper (in streaming mode)`, () => {
      assert.ok(!canPair(famId, 'viper', 'streaming'), `${famId} should not pair with viper in streaming`);
    });
  }
});

describe('Compatibility matrix — ethernet (CCM) cameras', () => {
  for (const famId of ccmFamilyIds) {
    it(`${famId} pairs ONLY with viper`, () => {
      assert.ok(canPair(famId, 'viper', 'streaming'), `${famId} should pair with viper`);
      for (const pid of processors.filter(p => p.id !== 'viper').map(p => p.id)) {
        assert.ok(!canPair(famId, pid, 'streaming'), `${famId} should NOT pair with ${pid}`);
      }
    });
  }
});

// ─── (b) Helios blocked on RT III ──────────────────────────────────────────

describe('Helios restrictions', () => {
  it('helios is blocked on rt3', () => {
    assert.ok(isProcessorBlocked('rt3', 'helios'));
  });
  it('helios is NOT blocked on rt4', () => {
    assert.ok(!isProcessorBlocked('rt4', 'helios'));
  });
  it('helios is NOT blocked on rtv', () => {
    assert.ok(!isProcessorBlocked('rtv', 'helios'));
  });
  it('restriction reason mentions GPU/8K', () => {
    const reason = restrictions.helios.reason;
    assert.ok(reason.includes('8K'), `reason should mention 8K, got: ${reason}`);
  });
  it('no other families have restrictions', () => {
    const restricted = Object.keys(restrictions);
    assert.deepEqual(restricted, ['helios']);
  });
});

// ─── (c) TC processors allow all fiber/usb-c cameras ────────────────────────

describe('TC processor compatibility', () => {
  for (const tcId of ['tc2-1', 'tc2-2']) {
    it(`${tcId} supports xstream-fiber and xstream-usbc`, () => {
      const conns = connsForProc(tcId);
      assert.ok(conns.includes('xstream-fiber'), `${tcId} should support fiber`);
      assert.ok(conns.includes('xstream-usbc'), `${tcId} should support usbc`);
    });
    it(`${tcId} pairs with all fiber cameras`, () => {
      for (const famId of fiberFamilyIds) {
        assert.ok(canPair(famId, tcId, 'streaming'), `${famId} should pair with ${tcId}`);
      }
    });
    it(`${tcId} pairs with all compact cameras`, () => {
      for (const famId of compactFamilyIds) {
        assert.ok(canPair(famId, tcId, 'streaming'), `${famId} should pair with ${tcId}`);
      }
    });
  }
});

// ─── (d) XSLink Hub detection ───────────────────────────────────────────────

describe('XSLink Hub detection', () => {
  const pureUsbcFamilies = compactFamilyIds.filter(id => !familyById(id).hybrid);
  // xsm, xstream, sugarcube

  for (const famId of pureUsbcFamilies) {
    for (const pid of fiberProcIds) {
      it(`${famId} on ${pid} (fiber proc) needs hub`, () => {
        assert.ok(needsXSLinkHub(famId, pid, 'streaming'), `${famId}+${pid} should need hub`);
      });
    }
    it(`${famId} on tb3 does NOT need hub`, () => {
      assert.ok(!needsXSLinkHub(famId, 'tb3', 'streaming'), `${famId}+tb3 should not need hub`);
    });
  }

  it('hybrid cameras in streaming mode on fiber proc need hub', () => {
    for (const famId of hybridFamilyIds) {
      for (const pid of fiberProcIds) {
        assert.ok(needsXSLinkHub(famId, pid, 'streaming'), `${famId}+${pid} streaming should need hub`);
      }
    }
  });

  it('hybrid cameras in ethernet mode never need hub', () => {
    for (const famId of hybridFamilyIds) {
      for (const pid of [...fiberProcIds, 'tb3', 'viper']) {
        assert.ok(!needsXSLinkHub(famId, pid, 'ethernet'), `${famId}+${pid} ethernet should not need hub`);
      }
    }
  });

  it('fiber cameras never need hub', () => {
    for (const famId of fiberFamilyIds) {
      for (const p of processors) {
        assert.ok(!needsXSLinkHub(famId, p.id, 'streaming'), `${famId}+${p.id} should not need hub`);
      }
    }
  });

  it('ethernet cameras never need hub', () => {
    for (const famId of ccmFamilyIds) {
      for (const p of processors) {
        assert.ok(!needsXSLinkHub(famId, p.id, 'streaming'), `${famId}+${p.id} should not need hub`);
      }
    }
  });
});

// ─── (e) Ethernet cameras only pair with Viper ──────────────────────────────

describe('Ethernet cameras — Viper exclusivity', () => {
  it('ccs and ccm are group ccm', () => {
    assert.equal(familyById('ccs').group, 'ccm');
    assert.equal(familyById('ccm').group, 'ccm');
  });
  it('only viper supports ethernet connection', () => {
    assert.deepEqual(ethernetProcIds, ['viper']);
  });
  it('ethernet connection maps to ccm group', () => {
    assert.equal(connById('ethernet').group, 'ccm');
  });
});

// ─── (f) Hybrid cameras (os2-gold, os2) ─────────────────────────────────────

describe('Hybrid cameras — mode switching', () => {
  for (const famId of hybridFamilyIds) {
    it(`${famId} has hybrid=true and hybridGroups=['compact','ccm']`, () => {
      const fam = familyById(famId);
      assert.ok(fam.hybrid);
      assert.deepEqual(fam.hybridGroups, ['compact', 'ccm']);
    });

    it(`${famId} in streaming mode → group=compact`, () => {
      assert.equal(effectiveGroup(famId, 'streaming'), 'compact');
    });

    it(`${famId} in ethernet mode → group=ccm`, () => {
      assert.equal(effectiveGroup(famId, 'ethernet'), 'ccm');
    });

    it(`${famId} in streaming mode pairs with usbc-capable processors`, () => {
      for (const pid of usbcProcIds) {
        assert.ok(canPair(famId, pid, 'streaming'), `${famId} streaming should pair with ${pid}`);
      }
    });

    it(`${famId} in ethernet mode pairs ONLY with viper`, () => {
      assert.ok(canPair(famId, 'viper', 'ethernet'), `${famId} ethernet should pair with viper`);
      for (const pid of processors.filter(p => p.id !== 'viper').map(p => p.id)) {
        assert.ok(!canPair(famId, pid, 'ethernet'), `${famId} ethernet should NOT pair with ${pid}`);
      }
    });
  }
});

// ─── (g) FPS drop rules ─────────────────────────────────────────────────────

describe('FPS drop warnings', () => {
  const affected = fpsDropRules.affectedFamilies;     // galileo, phoenix-gold, phoenix
  const singleCh = fpsDropRules.singleChannelProcessors; // rt3, tc2-1

  it('affected families are galileo, phoenix-gold, phoenix', () => {
    assert.deepEqual(affected.sort(), ['galileo', 'phoenix', 'phoenix-gold'].sort());
  });

  it('single-channel processors are rt3 and tc2-1', () => {
    assert.deepEqual(singleCh.sort(), ['rt3', 'tc2-1'].sort());
  });

  for (const famId of affected) {
    for (const pid of singleCh) {
      it(`${famId} on ${pid} triggers fps drop warning`, () => {
        assert.ok(fpsDropWarning(famId, pid));
      });
    }
    it(`${famId} on rt4 (dual-channel) does NOT trigger warning`, () => {
      assert.ok(!fpsDropWarning(famId, 'rt4'));
    });
    it(`${famId} on rtv (quad-channel) does NOT trigger warning`, () => {
      assert.ok(!fpsDropWarning(famId, 'rtv'));
    });
  }

  it('non-affected fiber families do NOT trigger warning on single-ch processors', () => {
    const nonAffected = fiberFamilyIds.filter(id => !affected.includes(id));
    for (const famId of nonAffected) {
      for (const pid of singleCh) {
        assert.ok(!fpsDropWarning(famId, pid), `${famId}+${pid} should NOT trigger warning`);
      }
    }
  });

  it('compact/ccm families never trigger warning', () => {
    const nonFiber = [...compactFamilyIds, ...ccmFamilyIds];
    for (const famId of nonFiber) {
      for (const pid of singleCh) {
        assert.ok(!fpsDropWarning(famId, pid), `${famId}+${pid} should NOT trigger warning`);
      }
    }
  });
});

// ─── (h) TB3 processor ──────────────────────────────────────────────────────

describe('TB3 processor constraints', () => {
  const tb3 = procById('tb3');

  it('tb3 only supports xstream-usbc', () => {
    assert.deepEqual(connsForProc('tb3'), ['xstream-usbc']);
  });

  it('tb3 has no hubSupport', () => {
    assert.ok(!tb3.hubSupport, 'tb3 should not have hubSupport');
  });

  it('compact-group cameras can connect to tb3', () => {
    for (const famId of compactFamilyIds) {
      assert.ok(canPair(famId, 'tb3', 'streaming'), `${famId} should pair with tb3`);
    }
  });

  it('fiber cameras cannot connect to tb3', () => {
    for (const famId of fiberFamilyIds) {
      assert.ok(!canPair(famId, 'tb3', 'streaming'), `${famId} should NOT pair with tb3`);
    }
  });

  it('ethernet cameras cannot connect to tb3', () => {
    for (const famId of ccmFamilyIds) {
      assert.ok(!canPair(famId, 'tb3', 'streaming'), `${famId} should NOT pair with tb3`);
    }
  });

  it('usb-c cameras on tb3 do not need hub', () => {
    for (const famId of compactFamilyIds) {
      assert.ok(!needsXSLinkHub(famId, 'tb3', 'streaming'), `${famId}+tb3 should not need hub`);
    }
  });
});
