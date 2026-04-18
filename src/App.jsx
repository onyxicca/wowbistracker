import { useState, useCallback, useEffect, useRef } from "react";

const HERO_TALENTS = {
  "blood":              ["Deathbringer","San'layn"],
  "frost-dk":           ["Deathbringer","Rider of the Apocalypse"],
  "unholy":             ["Rider of the Apocalypse","San'layn"],
  "havoc":              ["Aldrachi Reaver","Scarred"],
  "vengeance":          ["Aldrachi Reaver","Annihilator"],
  "devourer":           ["Scarred","Annihilator"],
  "balance":            ["Elune's Chosen","Keeper of the Grove"],
  "feral":              ["Druid of the Claw","Wildstalker"],
  "guardian":           ["Druid of the Claw","Elune's Chosen"],
  "restoration-druid":  ["Keeper of the Grove","Wildstalker"],
  "devastation":        ["Flameshaper","Scalecommander"],
  "preservation":       ["Flameshaper","Chronowarden"],
  "augmentation":       ["Scalecommander","Chronowarden"],
  "beast-mastery":      ["Pack Leader","Dark Ranger"],
  "marksmanship":       ["Dark Ranger","Sentinel"],
  "survival":           ["Pack Leader","Sentinel"],
  "arcane":             ["Spellslinger","Sunfury"],
  "fire":               ["Frostfire","Sunfury"],
  "frost-mage":         ["Frostfire","Spellslinger"],
  "brewmaster":         ["Master of Harmony","Shado-Pan"],
  "mistweaver":         ["Master of Harmony","Conduit of the Celestials"],
  "windwalker":         ["Shado-Pan","Conduit of the Celestials"],
  "holy-pala":          ["Herald of the Sun","Lightsmith"],
  "protection-pala":    ["Templar","Lightsmith"],
  "retribution":        ["Herald of the Sun","Templar"],
  "discipline":         ["Oracle","Voidweaver"],
  "holy-priest":        ["Oracle","Archon"],
  "shadow":             ["Voidweaver","Archon"],
  "assassination":      ["Deathstalker","Fatebound"],
  "outlaw":             ["Trickster","Fatebound"],
  "subtlety":           ["Deathstalker","Trickster"],
  "elemental":          ["Stormbringer","Farseer"],
  "enhancement":        ["Stormbringer","Totemic"],
  "restoration-sham":   ["Farseer","Totemic"],
  "affliction":         ["Hellcaller","Soul Harvester"],
  "demonology":         ["Soul Harvester","Diabolist"],
  "destruction":        ["Hellcaller","Diabolist"],
  "arms":               ["Slayer","Colossus"],
  "fury":               ["Slayer","Mountain Thane"],
  "protection-war":     ["Mountain Thane","Colossus"],
};

const SEEDED = {
  "blood:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Chest source not shown on Wowhead page — treat as Tier Set. Loa Worshiper's Band ring is crafted BiS.",
    slots: {
      weapon:    { name: "Garfrost's Two-Ton Hammer",    source: "Pit of Saron" },
      head:      { name: "Relentless Rider's Crown",     source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Eternal Voidsong Chain",       source: "Crown of the Cosmos" },
      shoulders: { name: "Relentless Rider's Dreadthorns", source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Defiant Defender's Drape",    source: "Magister's Terrace" },
      chest:     { name: "Relentless Rider's Cuirass",  source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Spellbreaker's Bracers",       source: "Crafting" },
      hands:     { name: "Voidclaw Gauntlets",           source: "Seat of the Triumvirate" },
      waist:     { name: "Bent Gold Belt",               source: "Pit of Saron" },
      legs:      { name: "Relentless Rider's Legguards", source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Greaves of the Unformed",      source: "Chimaerus" },
      finger1:   { name: "Eye of Midnight",              source: "Midnight Falls" },
      finger2:   { name: "Loa Worshiper's Band",         source: "Crafting" },
      trinket1:  { name: "Gaze of the Alnseer",          source: "Chimaerus" },
      trinket2:  { name: "Light Company Guidon",         source: "Imperator Averzian" },
    },
  },
  "frost-dk:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Two options: 2H Bellamy's Final Judgement or 1H Blade of the Final Twilight. Wrist and cloak are crafted with embellishments.",
    slots: {
      weapon:    { name: "Bellamy's Final Judgement (2H) / Blade of the Final Twilight (1H)", source: "Lightblinded Vanguard / Fallen-King Salhadaar" },
      head:      { name: "Relentless Rider's Crown",     source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",  source: "Midnight Falls" },
      shoulders: { name: "Shoulderplates of Frozen Blood", source: "Pit of Saron" },
      back:      { name: "Adherent's Silken Shroud",    source: "Crafting/Misc" },
      chest:     { name: "Relentless Rider's Cuirass",  source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Spellbreaker's Bracers",       source: "Crafting/Misc" },
      hands:     { name: "Relentless Rider's Bonegrasps", source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Hate-Tied Waistchain",         source: "Crown of the Cosmos" },
      legs:      { name: "Relentless Rider's Legguards", source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Greaves of the Unformed",      source: "Chimaerus" },
      finger1:   { name: "Platinum Star Band",           source: "Algeth'ar Academy" },
      finger2:   { name: "Sin'dorei Band of Hope",       source: "Belo'ren" },
      trinket1:  { name: "Light Company Guidon",         source: "Imperator Averzian" },
      trinket2:  { name: "Gaze of the Alnseer",          source: "Chimaerus" },
    },
  },
  "unholy:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Belt from Catalyst. Cloak and wrist are crafted.",
    slots: {
      weapon:    { name: "Bellamy's Final Judgement",   source: "Lightblinded Vanguard" },
      head:      { name: "Relentless Rider's Crown",    source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn", source: "Midnight Falls" },
      shoulders: { name: "Shoulderplates of Frozen Blood", source: "Pit of Saron" },
      back:      { name: "Adherent's Silken Shroud",   source: "Crafting" },
      chest:     { name: "Relentless Rider's Cuirass", source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Spellbreaker's Bracers",      source: "Crafting" },
      hands:     { name: "Relentless Rider's Bonegrasps", source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Relentless Rider's Chain",    source: "Tier Set — Raid | Catalyst | Vault" },
      legs:      { name: "Relentless Rider's Legguards", source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Greaves of the Unformed",     source: "Chimaerus" },
      finger1:   { name: "Platinum Star Band",          source: "Algeth'ar Academy" },
      finger2:   { name: "Sin'dorei Band of Hope",      source: "Belo'ren" },
      trinket1:  { name: "Gaze of the Alnseer",         source: "Chimaerus" },
      trinket2:  { name: "Light Company Guidon",        source: "Imperator Averzian" },
    },
  },

  "havoc:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Wrist (Silvermoon Agent's Deflectors) and cloak (Adherent's Silken Shroud) are crafted. Havoc tier set is Devouring Reaver's.",
    slots: {
      weapon:    { name: "Lightless Lament",                source: "Midnight Falls" },
      offhand:   { name: "Emblazoned Sunglaive",            source: "Vaelgor & Ezzorak" },
      head:      { name: "Spellsnap Shadowmask",            source: "Magister's Terrace" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls" },
      shoulders: { name: "Devouring Reaver's Exhaustplates", source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Adherent's Silken Shroud",       source: "Crafting/Misc" },
      chest:     { name: "Devouring Reaver's Engine",       source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Silvermoon Agent's Deflectors",   source: "Crafting/Misc" },
      hands:     { name: "Devouring Reaver's Essence Grips", source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Snapvine Cinch",                  source: "Windrunner Spire" },
      legs:      { name: "Devouring Reaver's Pistons",      source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Boots of Burning Focus",          source: "Skyreach" },
      finger1:   { name: "Sin'dorei Band of Hope",          source: "Belo'ren" },
      finger2:   { name: "Platinum Star Band",              source: "Algeth'ar Academy" },
      trinket1:  { name: "Algeth'ar Puzzle Box",            source: "Algeth'ar Academy" },
      trinket2:  { name: "Gaze of the Alnseer",             source: "Chimaerus" },
    },
  },
  "vengeance:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Cloak is crafted. Offhand options: Tormentor's Bladed Fists (Fallen-King Salhadaar) or Spellbreaker's Warglaive (Crafted). Defensive ring swap: Eye of Midnight + Loa Worshiper's Band.",
    slots: {
      weapon:    { name: "Lightless Lament",                source: "Midnight Falls" },
      offhand:   { name: "Tormentor's Bladed Fists",        source: "Fallen-King Salhadaar (or Spellbreaker's Warglaive Crafted)" },
      head:      { name: "Devouring Reaver's Intake",       source: "Tier Set — Lightblinded Vanguard" },
      neck:      { name: "Necklace of the Twisting Void",   source: "Seat of the Triumvirate" },
      shoulders: { name: "Devouring Reaver's Exhaustplates", source: "Tier Set — Fallen-King Salhadaar" },
      back:      { name: "Adherent's Silken Shroud",       source: "Crafting" },
      chest:     { name: "Vest of the Void's Embrace",      source: "Seat of the Triumvirate" },
      wrist:     { name: "Chewed Leather Wristguards",      source: "Pit of Saron" },
      hands:     { name: "Devouring Reaver's Essence Grips", source: "Tier Set — Vorasius" },
      waist:     { name: "Flayer's Black Belt",             source: "Pit of Saron" },
      legs:      { name: "Devouring Reaver's Pistons",      source: "Tier Set — Vaelgor & Ezzorak" },
      feet:      { name: "Eclipse Espadrilles",             source: "Nexus Point Xenas" },
      finger1:   { name: "Omission of Light",              source: "Nexus Point Xenas" },
      finger2:   { name: "Occlusion of Void",              source: "Nexus Point Xenas" },
      trinket1:  { name: "Gaze of the Alnseer",            source: "Chimaerus" },
      trinket2:  { name: "Light Company Guidon",           source: "Imperator Averzian" },
    },
  },
  "devourer:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Offhand: Spellbreaker's Warglaive crafted with Darkmoon Sigil: Hunt. Belt: Silvermoon Agent's Utility Belt with Arcanoweave Lining (Crafting). Boots from Catalyst.",
    slots: {
      weapon:    { name: "Lightless Lament",                source: "Midnight Falls" },
      offhand:   { name: "Spellbreaker's Warglaive + Darkmoon Sigil: Hunt", source: "Crafting" },
      head:      { name: "Devouring Reaver's Intake",       source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Eternal Voidsong Chain",          source: "Crown of the Cosmos" },
      shoulders: { name: "Devouring Reaver's Exhaustplates", source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Draconic Nullcape",               source: "Vaelgor & Ezzorak" },
      chest:     { name: "Devouring Reaver's Engine",       source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Frenzyroot Cuffs",                source: "Algeth'ar Academy" },
      hands:     { name: "Devouring Reaver's Essence Grips", source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Silvermoon Agent's Utility Belt + Arcanoweave Lining", source: "Crafting" },
      legs:      { name: "Shaggy Wyrmleather Leggings",     source: "Pit of Saron" },
      feet:      { name: "Devouring Reaver's Soul Flatteners", source: "Tier Set — Raid | Catalyst | Vault" },
      finger1:   { name: "Bond of Light",                   source: "Lightblinded Vanguard" },
      finger2:   { name: "Eye of Midnight",                 source: "Midnight Falls" },
      trinket1:  { name: "Gaze of the Alnseer",             source: "Chimaerus" },
      trinket2:  { name: "Vaelgor's Final Stare",           source: "Vaelgor & Ezzorak" },
    },
  },

  "balance:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Weapon is Belo'melorn from Belo'ren raid boss. Wrist (Silvermoon Agent's Deflectors) is crafted.",
    slots: {
      weapon:    { name: "Belo'melorn, the Shattered Talon", source: "Belo'ren" },
      offhand:   { name: "Aln'hara Lantern",               source: "Crafting" },
      head:      { name: "Branches of the Luminous Bloom", source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls" },
      shoulders: { name: "Seedpods of the Luminous Bloom", source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Draconic Nullcape",               source: "Vaelgor & Ezzorak" },
      chest:     { name: "Trunk of the Luminous Bloom",    source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Silvermoon Agent's Deflectors",   source: "Crafting" },
      hands:     { name: "Gloves of Viscous Goo",           source: "Magister's Terrace" },
      waist:     { name: "Snapvine Cinch",                  source: "Windrunner Spire" },
      legs:      { name: "Phloemwraps of the Luminous Bloom", source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Canopy Walker's Footwraps",       source: "Crown of the Cosmos" },
      finger1:   { name: "Platinum Star Band",              source: "Algeth'ar Academy" },
      finger2:   { name: "Occlusion of Void",              source: "Nexus-Point Xenas" },
      trinket1:  { name: "Vaelgor's Final Stare",           source: "Vaelgor & Ezzorak" },
      trinket2:  { name: "Locus-Walker's Ribbon",           source: "Crown of the Cosmos" },
    },
  },
  "feral:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Tier set is Luminous Bloom. Both wrist and gloves are crafted (Silvermoon Agent's items). Weapon ilevel matters more than specific weapon — don't skip upgrades.",
    slots: {
      weapon:    { name: "Inescapable Reach",               source: "Vorasius" },
      head:      { name: "Branches of the Luminous Bloom", source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls" },
      shoulders: { name: "Seedpods of the Luminous Bloom", source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Draconic Nullcape",               source: "Vaelgor & Ezzorak" },
      chest:     { name: "Trunk of the Luminous Bloom",    source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Silvermoon Agent's Deflectors",   source: "Crafting/Misc" },
      hands:     { name: "Silvermoon Agent's Handwraps",    source: "Crafting/Misc" },
      waist:     { name: "Snapvine Cinch",                  source: "Windrunner Spire" },
      legs:      { name: "Phloemwraps of the Luminous Bloom", source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Canopy Walker's Footwraps",       source: "Crown of the Cosmos" },
      finger1:   { name: "Eye of Midnight",                 source: "Midnight Falls" },
      finger2:   { name: "Bifurcation Band",               source: "Magister's Terrace" },
      trinket1:  { name: "Algeth'ar Puzzle Box",            source: "Algeth'ar Academy" },
      trinket2:  { name: "Radiant Plume",                   source: "Belo'ren" },
    },
  },
  "guardian:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Prioritize high-ilevel weapon first, then tier set. Flexible defensive trinkets depending on content.",
    slots: {
      weapon:    { name: "Alnscorned Spire",                source: "Chimaerus" },
      head:      { name: "Mask of Darkest Intent",          source: "Midnight Falls" },
      neck:      { name: "Eternal Voidsong Chain",          source: "Crown of the Cosmos" },
      shoulders: { name: "Seedpods of the Luminous Bloom", source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Draconic Nullcape",               source: "Vaelgor & Ezzorak" },
      chest:     { name: "Trunk of the Luminous Bloom",    source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Void-Skinned Bracers",            source: "Vorasius" },
      hands:     { name: "Arbortenders of the Luminous Bloom", source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Scorn-Scarred Shul'ka's Belt",   source: "Chimaerus" },
      legs:      { name: "Phloemwraps of the Luminous Bloom", source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Void-Claimed Shinkickers",        source: "Imperator Averzian" },
      finger1:   { name: "Omission of Light",              source: "Nexus Point Xenas" },
      finger2:   { name: "Eye of Midnight",                 source: "Midnight Falls" },
      trinket1:  { name: "Gaze of the Alnseer",             source: "Chimaerus" },
      trinket2:  { name: "Algeth'ar Puzzle Box",            source: "Algeth'ar Academy" },
    },
  },
  "restoration-druid:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Two crafted embellishment pieces not listed here — BiS crafts change as season progresses. Chest is off-tier (Maledict Vest). Aim for mastery and haste.",
    slots: {
      weapon:    { name: "Belo'melorn, the Shattered Talon", source: "Belo'ren (Raid)" },
      offhand:   { name: "Tome of Alnscorned Regret",       source: "Chimaerus (Raid)" },
      head:      { name: "Branches of the Luminous Bloom", source: "Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls (Raid)" },
      shoulders: { name: "Seedpods of the Luminous Bloom", source: "Raid | Catalyst | Vault" },
      back:      { name: "Draconic Nullcape",               source: "Vaelgor & Ezzorak (Raid)" },
      chest:     { name: "Maledict Vest",                   source: "Nexus Point Xenas" },
      wrist:     { name: "Frenzyroot Cuffs",                source: "Algeth'ar Academy" },
      hands:     { name: "Arbortenders of the Luminous Bloom", source: "Raid | Catalyst | Vault" },
      waist:     { name: "Twisted Twilight Sash",           source: "Fallen-King Salhadaar (Raid)" },
      legs:      { name: "Phloemwraps of the Luminous Bloom", source: "Raid | Catalyst | Vault" },
      feet:      { name: "Eclipse Espadrilles",             source: "Nexus Point Xenas" },
      finger1:   { name: "Eye of Midnight",                 source: "Midnight Falls (Raid)" },
      finger2:   { name: "Bifurcation Band",               source: "Magister's Terrace" },
      trinket1:  { name: "Locus-Walker's Ribbon",           source: "Crown of the Cosmos (Raid)" },
      trinket2:  { name: "Vaelgor's Final Stare",           source: "Vaelgor & Ezzorak (Raid)" },
    },
  },

  "devastation:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Wrist (Farstrider's Plated Bracers) and cloak (Adherent's Silken Shroud) are crafted. Tier set is Black Talon.",
    slots: {
      weapon:    { name: "Belo'melorn, the Shattered Talon", source: "Belo'ren" },
      offhand:   { name: "Grimoire of the Eternal Light",   source: "Vorasius" },
      head:      { name: "Hornhelm of the Black Talon",     source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls" },
      shoulders: { name: "Beacons of the Black Talon",      source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Adherent's Silken Shroud",       source: "Crafting" },
      chest:     { name: "Frenzyward of the Black Talon",   source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Farstrider's Plated Bracers",     source: "Crafting" },
      hands:     { name: "Untethered Berserker's Grips",    source: "Crown of the Cosmos" },
      waist:     { name: "Scabrous Zombie Belt",            source: "Pit of Saron" },
      legs:      { name: "Greaves of the Black Talon",      source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Darkstrider Treads",              source: "Belo'ren" },
      finger1:   { name: "Sin'dorei Band of Hope",          source: "Belo'ren" },
      finger2:   { name: "Eye of Midnight",                 source: "Midnight Falls" },
      trinket1:  { name: "Vaelgor's Final Stare",           source: "Vaelgor & Ezzorak" },
      trinket2:  { name: "Locus-Walker's Ribbon",           source: "Crown of the Cosmos" },
    },
  },
  "preservation:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Two crafted embellishment pieces not listed — vary by season stage. Aims for mastery, moderate haste, moderate crit. Tier set is Black Talon.",
    slots: {
      weapon:    { name: "Umbral Spire of Zuraal (2H)",     source: "Seat of the Triumvirate" },
      head:      { name: "Oblivion Guise",                  source: "Midnight Falls (Raid)" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls (Raid)" },
      shoulders: { name: "Beacons of the Black Talon",      source: "Raid | Catalyst | Vault" },
      back:      { name: "Fluxweave Cloak",                 source: "Nexus Point Xenas" },
      chest:     { name: "Frenzyward of the Black Talon",   source: "Raid | Catalyst | Vault" },
      wrist:     { name: "Amberfrond Bracers",              source: "Windrunner Spire" },
      hands:     { name: "Enforcer's Grips of the Black Talon", source: "Raid | Catalyst | Vault" },
      waist:     { name: "Azure Belt of Competition",       source: "Algeth'ar Academy" },
      legs:      { name: "Greaves of the Black Talon",      source: "Raid | Catalyst | Vault" },
      feet:      { name: "Whipcoil Sabatons",               source: "Windrunner Spire" },
      finger1:   { name: "Bond of Light",                   source: "Lightblinded Vanguard (Raid)" },
      finger2:   { name: "Eye of Midnight",                 source: "Midnight Falls (Raid)" },
      trinket1:  { name: "Vaelgor's Final Stare",           source: "Vaelgor & Ezzorak (Raid)" },
      trinket2:  { name: "Locus-Walker's Ribbon",           source: "Crown of the Cosmos (Raid)" },
    },
  },
  "augmentation:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Wrist and cloak are crafted. Boots from Catalyst. Maximize ilevel in highest-value slots early as possible.",
    slots: {
      weapon:    { name: "Ceremonial Hexblade",             source: "Maisara Caverns" },
      offhand:   { name: "Grimoire of the Eternal Light",   source: "Vorasius" },
      head:      { name: "Horns of the Spurned Val'kyr",    source: "Pit of Saron" },
      neck:      { name: "Ribbon of Coiled Malice",         source: "Fallen-King Salhadaar" },
      shoulders: { name: "Beacons of the Black Talon",      source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Adherent's Silken Shroud",       source: "Crafting" },
      chest:     { name: "Frenzyward of the Black Talon",   source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Farstrider's Plated Bracers",     source: "Crafting" },
      hands:     { name: "Enforcer's Grips of the Black Talon", source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Scabrous Zombie Belt",            source: "Pit of Saron" },
      legs:      { name: "Greaves of the Black Talon",      source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Spelltreads of the Black Talon",  source: "The Catalyst" },
      finger1:   { name: "Eye of Midnight",                 source: "Midnight Falls" },
      finger2:   { name: "Purloined Wedding Ring",          source: "Pit of Saron" },
      trinket1:  { name: "Shadow of the Empyrean Requiem",  source: "Midnight Falls" },
      trinket2:  { name: "Soulcatcher's Charm",             source: "Maisara Caverns" },
    },
  },

  "beast-mastery:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Belt and boots are Leatherworking crafted. Tier set is Primal Sentry's.",
    slots: {
      weapon:    { name: "Deceiver's Rotbow",               source: "Maisara Caverns" },
      head:      { name: "Primal Sentry's Maw",             source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls" },
      shoulders: { name: "Pauldrons of the Void Hunter",    source: "Seat of the Triumvirate" },
      back:      { name: "Rigid Scale Greatcloak",          source: "Skyreach" },
      chest:     { name: "Primal Sentry's Scaleplate",      source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Corewarden Cuffs",                source: "Nexus Point Xenas" },
      hands:     { name: "Primal Sentry's Talonguards",     source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "World Tender's Barkclasp",        source: "Leatherworking" },
      legs:      { name: "Primal Sentry's Legguards",       source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "World Tender's Rootslippers",     source: "Leatherworking" },
      finger1:   { name: "Eye of Midnight",                 source: "Midnight Falls" },
      finger2:   { name: "Bond of Light",                   source: "Lightblinded Vanguard" },
      trinket1:  { name: "Radiant Plume",                   source: "Belo'ren" },
      trinket2:  { name: "Algeth'ar Puzzle Box",            source: "Algeth'ar Academy" },
    },
  },
  "marksmanship:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Belt and boots are crafted. Tier set is Primal Sentry's.",
    slots: {
      weapon:    { name: "Ranger-Captain's Lethal Recurve", source: "Crown of the Cosmos" },
      head:      { name: "Primal Sentry's Maw",             source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls" },
      shoulders: { name: "Pauldrons of the Void Hunter",    source: "Seat of the Triumvirate" },
      back:      { name: "Imperator's Banner",              source: "Imperator Averzian" },
      chest:     { name: "Primal Sentry's Scaleplate",      source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Fallen King's Cuffs",             source: "Fallen-King Salhadaar" },
      hands:     { name: "Primal Sentry's Talonguards",     source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "World Tender's Barkclasp",        source: "Crafting" },
      legs:      { name: "Primal Sentry's Legguards",       source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "World Tender's Rootslippers",     source: "Crafting" },
      finger1:   { name: "Sin'dorei Band of Hope",          source: "Belo'ren" },
      finger2:   { name: "Signet of the Starved Beast",     source: "Vorasius" },
      trinket1:  { name: "Algeth'ar Puzzle Box",            source: "Algeth'ar Academy" },
      trinket2:  { name: "Umbral Plume",                    source: "Belo'ren" },
    },
  },
  "survival:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Prioritize Mastery on gear. Belt and boots are crafted. Two weapon options: 2H Roostwarden's Bough or dual wield (Belo'ren's Swift Talon + Farstrider's Mercy).",
    slots: {
      weapon:    { name: "Roostwarden's Bough (2H) / Belo'ren's Swift Talon (1H)", source: "Windrunner Spire / Belo'ren" },
      offhand:   { name: "Farstrider's Mercy (if dual wield)",  source: "Crafting" },
      head:      { name: "Primal Sentry's Maw",             source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "L'ura (March on Quel'Danas)" },
      shoulders: { name: "Pauldrons of the Void Hunter",    source: "Seat of the Triumvirate" },
      back:      { name: "Draconic Nullcape",               source: "Vaelgor" },
      chest:     { name: "Primal Sentry's Scaleplate",      source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Fallen King's Cuffs",             source: "Fallen-King Salhadaar" },
      hands:     { name: "Primal Sentry's Talonguards",     source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Scornbane Waistguard",            source: "Chimaerus" },
      legs:      { name: "Primal Sentry's Legguards",       source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Farstrider's Razor Talons",       source: "Crafting" },
      finger1:   { name: "Omission of Light",              source: "Nexus Point Xenas" },
      finger2:   { name: "Occlusion of Void",              source: "Nexus Point Xenas" },
      trinket1:  { name: "Algeth'ar Puzzle Box",            source: "Algeth'ar Academy" },
      trinket2:  { name: "Radiant Plume",                   source: "Belo'ren" },
    },
  },

  "arcane:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Cloak and wrist are crafted. Cantrip items (trinkets with special effects) are highest priority — sim yourself for exact rankings. Tier set is Voidbreaker's.",
    slots: {
      weapon:    { name: "Skybreaker's Blade",              source: "Skyreach" },
      offhand:   { name: "Sigil of the Restless Heart",    source: "Windrunner Spire" },
      head:      { name: "Voidbreaker's Veil",              source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls" },
      shoulders: { name: "Voidbreaker's Leyline Nexi",     source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Arcanoweave Cloak",               source: "Crafting" },
      chest:     { name: "Voidbreaker's Robe",              source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Arcanoweave Bracers",             source: "Crafting" },
      hands:     { name: "Voidbreaker's Gloves",            source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Whisper-Inscribed Sash",          source: "Belo'ren" },
      legs:      { name: "Commander's Faded Breeches",      source: "Windrunner Spire" },
      feet:      { name: "Dream-Scorched Striders",         source: "Chimaerus" },
      finger1:   { name: "Sin'dorei Band of Hope",          source: "Belo'ren" },
      finger2:   { name: "Eye of Midnight",                 source: "Midnight Falls" },
      trinket1:  { name: "Vaelgor's Final Stare",           source: "Vaelgor & Ezzorak" },
      trinket2:  { name: "Gaze of the Alnseer",             source: "Chimaerus" },
    },
  },
  "fire:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Cloak and wrist are crafted. Chest is off-tier (Robes of Endless Oblivion from Midnight Falls raid). Tier set is Voidbreaker's.",
    slots: {
      weapon:    { name: "Brazier of the Dissonant Dirge",  source: "Midnight Falls" },
      head:      { name: "Voidbreaker's Veil",              source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls" },
      shoulders: { name: "Voidbreaker's Leyline Nexi",     source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Adherent's Silken Shroud",       source: "Crafting" },
      chest:     { name: "Robes of Endless Oblivion",       source: "Midnight Falls" },
      wrist:     { name: "Martyr's Bindings",               source: "Crafting" },
      hands:     { name: "Voidbreaker's Gloves",            source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Whisper-Inscribed Sash",          source: "Belo'ren" },
      legs:      { name: "Voidbreaker's Britches",          source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Lightbinder Treads",              source: "Skyreach" },
      finger1:   { name: "Eye of Midnight",                 source: "Midnight Falls" },
      finger2:   { name: "Bond of Light",                   source: "Lightblinded Vanguard" },
      trinket1:  { name: "Emberwing Feather",               source: "Windrunner Spire" },
      trinket2:  { name: "Locus-Walker's Ribbon",           source: "Crown of the Cosmos" },
    },
  },
  "frost-mage:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "4 tier pieces + strong trinkets are the core. Other slots are mostly ilevel-based. Wrist crafted.",
    slots: {
      weapon:    { name: "Skybreaker's Blade",              source: "Skyreach" },
      offhand:   { name: "Aln'hara Lantern",               source: "Crafting" },
      head:      { name: "Voidbreaker's Veil",              source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",     source: "Midnight Falls" },
      shoulders: { name: "Mantle of Dark Devotion",         source: "Windrunner Spire" },
      back:      { name: "Rigid Scale Greatcloak",          source: "Skyreach" },
      chest:     { name: "Voidbreaker's Robe",              source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Martyr's Bindings",               source: "Crafting" },
      hands:     { name: "Voidbreaker's Gloves",            source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Voidbreaker's Sage Cord",         source: "The Catalyst" },
      legs:      { name: "Voidbreaker's Britches",          source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Dream-Scorched Striders",         source: "Chimaerus" },
      finger1:   { name: "Eye of Midnight",                 source: "Midnight Falls" },
      finger2:   { name: "Sin'dorei Band of Hope",          source: "Belo'ren" },
      trinket1:  { name: "Gaze of the Alnseer",             source: "Chimaerus" },
      trinket2:  { name: "Vaelgor's Final Stare",           source: "Vaelgor & Ezzorak" },
    },
  },

  "brewmaster:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Neck is Jewelcrafting (Masterwork Sin'dorei Amulet with Thalassian Missive of the Quickblade + Stabilizing Gemstone Bandolier). Cloak from Imperator Averzian. Prioritize weapon ilevel, then tier set.",
    slots: {
      weapon:    { name: "Inescapable Reach (2H) / Dreadflail Bludgeon (1H)", source: "Vorasius / Nexus Point Xenas" },
      offhand:   { name: "Soulblight Cleaver (if dual wield)",  source: "Maisara Caverns" },
      head:      { name: "Fearsome Visage of Ra-den's Chosen",  source: "Catalyst | Raid | Vault" },
      neck:      { name: "Masterwork Sin'dorei Amulet",         source: "Jewelcrafting" },
      shoulders: { name: "Aurastones of Ra-den's Chosen",       source: "Catalyst | Raid | Vault" },
      back:      { name: "Imperator's Banner",                  source: "Imperator Averzian" },
      chest:     { name: "Battle Garb of Ra-den's Chosen",      source: "Catalyst | Raid | Vault" },
      wrist:     { name: "Strikeguards of Ra-den's Chosen",     source: "Tier Set — Raid | Catalyst | Vault" },
      hands:     { name: "Thunderfists of Ra-den's Chosen",     source: "Catalyst | Raid | Vault" },
      waist:     { name: "Snapvine Cinch",                      source: "Windrunner Spire" },
      legs:      { name: "Shifting Stalker Hide Pants",         source: "Seat of the Triumvirate" },
      feet:      { name: "Footpads of Seeping Dread",           source: "Seat of the Triumvirate" },
      finger1:   { name: "Signet of the Starved Beast",         source: "Vorasius" },
      finger2:   { name: "Loa Worshiper's Band",                source: "Jewelcrafting" },
      trinket1:  { name: "Radiant Plume",                       source: "Belo'ren" },
      trinket2:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
    },
  },
  "mistweaver:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Two embellishment pieces not listed. Head BiS is catalyzed Mask of Darkest Intent — leech tertiary persists through catalyst. Tier set is Ra-den's Chosen.",
    slots: {
      weapon:    { name: "Arcanic of the High Sage",            source: "Skyreach" },
      offhand:   { name: "Grimoire of the Eternal Light",       source: "Vorasius (Raid)" },
      head:      { name: "Fearsome Visage of Ra-den's Chosen",  source: "Catalyst via Mask of Darkest Intent" },
      neck:      { name: "Barbed Ymirheim Choker",              source: "Pit of Saron" },
      shoulders: { name: "Blooming Barklight Spaulders",        source: "Lightblinded Vanguard (Raid)" },
      back:      { name: "Defiant Defender's Drape",           source: "Magister's Terrace" },
      chest:     { name: "Battle Garb of Ra-den's Chosen",      source: "Raid | Catalyst | Vault" },
      wrist:     { name: "Void-Skinned Bracers",                source: "Vorasius (Raid)" },
      hands:     { name: "Thunderfists of Ra-den's Chosen",     source: "Raid | Catalyst | Vault" },
      waist:     { name: "Scorn-Scarred Shul'ka's Belt",        source: "Chimaerus (Raid)" },
      legs:      { name: "Swiftsweepers of Ra-den's Chosen",    source: "Raid | Catalyst | Vault" },
      feet:      { name: "Storm Crashers of Ra-den's Chosen",   source: "Tier Set — Raid | Catalyst | Vault" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls (Raid)" },
      finger2:   { name: "Purloined Wedding Ring",              source: "Pit of Saron" },
      trinket1:  { name: "Litany of Lightblind Wrath",          source: "Lightblinded Vanguard (Raid)" },
      trinket2:  { name: "Gaze of the Alnseer",                 source: "Chimaerus (Raid)" },
    },
  },
  "windwalker:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Ring is crafted (Loa Worshiper's Band). Tier set is Ra-den's Chosen. Cloak from Catalyst.",
    slots: {
      weapon:    { name: "Traitor's Talon (2H) / Arator's Swift Remembrance (1H)", source: "Maisara Caverns / Crown of the Cosmos" },
      offhand:   { name: "Bloomforged Claw (if dual wield)",    source: "Crafting" },
      head:      { name: "Fearsome Visage of Ra-den's Chosen",  source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",         source: "Midnight Falls" },
      shoulders: { name: "Aurastones of Ra-den's Chosen",       source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Windwrap of Ra-den's Chosen",         source: "The Catalyst" },
      chest:     { name: "Battle Garb of Ra-den's Chosen",      source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Void-Skinned Bracers",                source: "Vorasius" },
      hands:     { name: "Vaelgor's Fearsome Grasp",            source: "Vaelgor & Ezzorak" },
      waist:     { name: "Snapvine Cinch",                      source: "Windrunner Spire" },
      legs:      { name: "Swiftsweepers of Ra-den's Chosen",    source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Storm Crashers of Ra-den's Chosen",   source: "The Catalyst" },
      finger1:   { name: "Loa Worshiper's Band",                source: "Crafting" },
      finger2:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
      trinket2:  { name: "Algeth'ar Puzzle Box",                source: "Algeth'ar Academy" },
    },
  },

  "holy-pala:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Tier set for Holy Paladin is Luminant Verdict's. Always use Questionably Epic to confirm upgrades for your character.",
    slots: {
      weapon:    { name: "Spellboon Saber",                     source: "Algeth'ar Academy" },
      offhand:   { name: "Viryx's Indomitable Bulwark (Shield)", source: "Skyreach" },
      head:      { name: "Luminant Verdict's Unwavering Gaze",  source: "Lightblinded Vanguard" },
      neck:      { name: "Amulet of the Abyssal Hymn",         source: "Midnight Falls" },
      shoulders: { name: "Luminant Verdict's Providence Watch", source: "Fallen-King Salhadaar" },
      back:      { name: "Rigid Scale Greatcloak",              source: "Skyreach" },
      chest:     { name: "Luminant Verdict's Divine Warplate",  source: "Chimaerus" },
      wrist:     { name: "Trollhunter's Bands",                 source: "Maisara Caverns" },
      hands:     { name: "Luminant Verdict's Gauntlets",        source: "Vorasius" },
      waist:     { name: "Ezzorak's Gloombind",                 source: "Vaelgor & Ezzorak" },
      legs:      { name: "Extinction Guards",                   source: "Midnight Falls" },
      feet:      { name: "Parasite Stompers",                   source: "Vorasius" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      finger2:   { name: "Sin'dorei Band of Hope",              source: "Belo'ren" },
      trinket1:  { name: "Locus-Walker's Ribbon",               source: "Crown of the Cosmos" },
      trinket2:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
    },
  },
  "protection-pala:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Aim for high haste. Tier set is Luminant Verdict's. Pick up both offensive and defensive trinkets for flexibility.",
    slots: {
      weapon:    { name: "Turalyon's False Echo",               source: "Crown of the Cosmos" },
      offhand:   { name: "Thalassian Dawnguard",               source: "Belo'ren" },
      head:      { name: "Luminant Verdict's Unwavering Gaze",  source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Eternal Voidsong Chain",              source: "Crown of the Cosmos" },
      shoulders: { name: "Luminant Verdict's Providence Watch", source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Draconic Nullcape",                   source: "Vaelgor & Ezzorak" },
      chest:     { name: "Luminant Verdict's Divine Warplate",  source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Light's March Bracers",               source: "Imperator Averzian" },
      hands:     { name: "Voidclaw Gauntlets",                  source: "Seat of the Triumvirate" },
      waist:     { name: "Ezzorak's Gloombind",                 source: "Vaelgor & Ezzorak" },
      legs:      { name: "Luminant Verdict's Greaves",          source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Greaves of the Unformed",             source: "Chimaerus" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      finger2:   { name: "Band of the Triumvirate",             source: "Seat of the Triumvirate" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
      trinket2:  { name: "Heart of Ancient Hunger",             source: "Vorasius" },
    },
  },
  "retribution:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Cloak and wrist are crafted. Multiple comparable stat distributions exist — treat this as reference. Tier set is Luminant Verdict's.",
    slots: {
      weapon:    { name: "Bellamy's Final Judgement",           source: "Lightblinded Vanguard" },
      head:      { name: "Luminant Verdict's Unwavering Gaze",  source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",         source: "Midnight Falls" },
      shoulders: { name: "Luminant Verdict's Providence Watch", source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Adherent's Silken Shroud",           source: "Crafting/Misc" },
      chest:     { name: "Luminant Verdict's Divine Warplate",  source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Spellbreaker's Bracers",              source: "Crafting/Misc" },
      hands:     { name: "Voidclaw Gauntlets",                  source: "Seat of the Triumvirate" },
      waist:     { name: "Hate-Tied Waistchain",                source: "Crown of the Cosmos" },
      legs:      { name: "Luminant Verdict's Greaves",          source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Greaves of the Unformed",             source: "Chimaerus" },
      finger1:   { name: "Sin'dorei Band of Hope",              source: "Belo'ren" },
      finger2:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      trinket1:  { name: "Umbral Plume",                        source: "Belo'ren" },
      trinket2:  { name: "Algeth'ar Puzzle Box",                source: "Algeth'ar Academy" },
    },
  },

  "discipline:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Two embellishment crafts not listed — vary by season stage. Chest is off-tier (Robes of Endless Oblivion). Aim for haste in most slots. Tier set is Blind Oath's.",
    slots: {
      weapon:    { name: "Belo'melorn, the Shattered Talon",    source: "Belo'ren (Raid)" },
      offhand:   { name: "Aln'hara Lantern",                    source: "Crafting/Misc" },
      head:      { name: "Blind Oath's Winged Crest",           source: "Raid | Catalyst | Vault" },
      neck:      { name: "Eternal Voidsong Chain",              source: "Crown of the Cosmos (Raid)" },
      shoulders: { name: "Blind Oath's Seraphguards",           source: "Raid | Catalyst | Vault" },
      back:      { name: "Draconic Nullcape",                   source: "Vaelgor & Ezzorak (Raid)" },
      chest:     { name: "Robes of Endless Oblivion",           source: "Midnight Falls (Raid)" },
      wrist:     { name: "Voracious Wristwraps",                source: "Vorasius (Raid)" },
      hands:     { name: "Blind Oath's Touch",                  source: "Raid | Catalyst | Vault" },
      waist:     { name: "Arcanoweave Cord",                    source: "Crafting/Misc" },
      legs:      { name: "Blind Oath's Leggings",               source: "Raid | Catalyst | Vault" },
      feet:      { name: "Lightbinder Treads",                  source: "Skyreach" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls (Raid)" },
      finger2:   { name: "Omission of Light",                  source: "Nexus Point Xenas" },
      trinket1:  { name: "Litany of Lightblind Wrath",          source: "War Chaplain Senn (Raid)" },
      trinket2:  { name: "Vaelgor's Final Stare",               source: "Vaelgor & Ezzorak (Raid)" },
    },
  },
  "holy-priest:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Two embellishment pieces not listed. Belt is crafted (Arcanoweave Cord). Aim for mastery and crit. Tier set is Blind Oath's.",
    slots: {
      weapon:    { name: "Weight of Command",                   source: "Imperator Averzian (Raid)" },
      offhand:   { name: "Aln'hara Lantern",                    source: "Crafting/Misc" },
      head:      { name: "Blind Oath's Winged Crest",           source: "Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",         source: "Midnight Falls (Raid)" },
      shoulders: { name: "Blind Oath's Seraphguards",           source: "Raid | Catalyst | Vault" },
      back:      { name: "Imperator's Banner",                  source: "Imperator Averzian (Raid)" },
      chest:     { name: "Robes of Endless Oblivion",           source: "Midnight Falls (Raid)" },
      wrist:     { name: "Blind Oath's Wraps",                  source: "Raid | Catalyst | Vault" },
      hands:     { name: "Blind Oath's Touch",                  source: "Raid | Catalyst | Vault" },
      waist:     { name: "Arcanoweave Cord",                    source: "Crafting/Misc" },
      legs:      { name: "Blind Oath's Leggings",               source: "Raid | Catalyst | Vault" },
      feet:      { name: "Dream-Scorched Striders",             source: "Chimaerus" },
      finger1:   { name: "Signet of the Starved Beast",         source: "Vorasius (Raid)" },
      finger2:   { name: "Sin'dorei Band of Hope",              source: "Belo'ren (Raid)" },
      trinket1:  { name: "Locus-Walker's Ribbon",               source: "Crown of the Cosmos (Raid)" },
      trinket2:  { name: "Litany of Lightblind Wrath",          source: "War Chaplain Senn (Raid)" },
    },
  },
  "shadow:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Two embellishment pieces not listed. Chest is off-tier (Blind Oath's Raiment from tier set, Raid | Catalyst | Vault). Aim for haste. Tier set is Blind Oath's.",
    slots: {
      weapon:    { name: "Belo'melorn, the Shattered Talon",    source: "Belo'ren (Raid)" },
      offhand:   { name: "Tome of Alnscorned Regret",          source: "Chimaerus (Raid)" },
      head:      { name: "Blind Oath's Winged Crest",           source: "Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",         source: "Midnight Falls (Raid)" },
      shoulders: { name: "Blind Oath's Seraphguards",           source: "Raid | Catalyst | Vault" },
      back:      { name: "Draconic Nullcape",                   source: "Vaelgor & Ezzorak (Raid)" },
      chest:     { name: "Blind Oath's Raiment",               source: "Raid | Catalyst | Vault" },
      wrist:     { name: "Wraps of Watchful Wrath",             source: "Magister's Terrace" },
      hands:     { name: "Blind Oath's Touch",                  source: "Raid | Catalyst | Vault" },
      waist:     { name: "Whisper-Inscribed Sash",              source: "Belo'ren (Raid)" },
      legs:      { name: "Blind Oath's Leggings",               source: "Raid | Catalyst | Vault" },
      feet:      { name: "Dream-Scorched Striders",             source: "Chimaerus" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls (Raid)" },
      finger2:   { name: "Bond of Light",                       source: "Lightblinded Vanguard (Raid)" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus (Raid)" },
      trinket2:  { name: "Vaelgor's Final Stare",               source: "Vaelgor & Ezzorak (Raid)" },
    },
  },

  "assassination:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Wrist (Silvermoon Agent's Deflectors) crafted. Tier set is Grim Jest's. Prioritize Critical Strike, Haste, Mastery.",
    slots: {
      weapon:    { name: "Hungering Victory",                   source: "Vorasius" },
      offhand:   { name: "Farstrider's Mercy",                  source: "Crafting" },
      head:      { name: "Masquerade of the Grim Jest",         source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Ribbon of Coiled Malice",             source: "Fallen-King Salhadaar" },
      shoulders: { name: "Venom Casks of the Grim Jest",        source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Defiant Defender's Drape",           source: "Magister's Terrace" },
      chest:     { name: "Fantastic Finery of the Grim Jest",   source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Silvermoon Agent's Deflectors",       source: "Crafting" },
      hands:     { name: "Sleight of Hand of the Grim Jest",    source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Scorn-Scarred Shul'ka's Belt",        source: "Chimaerus" },
      legs:      { name: "Legwraps of Lingering Legacies",      source: "Windrunner Spire" },
      feet:      { name: "Canopy Walker's Footwraps",           source: "Crown of the Cosmos" },
      finger1:   { name: "Sin'dorei Band of Hope",              source: "Belo'ren" },
      finger2:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
      trinket2:  { name: "Algeth'ar Puzzle Box",                source: "Algeth'ar Academy" },
    },
  },
  "outlaw:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "No burst cooldown — on-use stat trinkets less valuable than other specs. Gear heavily invested in Crit and Haste. Boots crafted. Tier set is Grim Jest's.",
    slots: {
      weapon:    { name: "Arator's Swift Remembrance",          source: "Crown of the Cosmos" },
      offhand:   { name: "Krick's Beetle Stabber",              source: "Pit of Saron" },
      head:      { name: "Voidlashed Hood",                     source: "Seat of the Triumvirate" },
      neck:      { name: "Barbed Ymirheim Choker",              source: "Pit of Saron" },
      shoulders: { name: "Venom Casks of the Grim Jest",        source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Imperator's Banner",                  source: "Imperator Averzian" },
      chest:     { name: "Fantastic Finery of the Grim Jest",   source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Chewed Leather Wristguards",          source: "Pit of Saron" },
      hands:     { name: "Sleight of Hand of the Grim Jest",    source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Scorn-Scarred Shul'ka's Belt",        source: "Chimaerus" },
      legs:      { name: "Blade Holsters of the Grim Jest",     source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Silvermoon Agent's Sneakers",         source: "Crafting" },
      finger1:   { name: "Signet of the Starved Beast",         source: "Vorasius" },
      finger2:   { name: "Masterwork Sin'dorei Band",           source: "Crafting" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
      trinket2:  { name: "Umbral Plume",                        source: "Belo'ren" },
    },
  },
  "subtlety:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Belt crafted (Silvermoon Agent's Utility Belt). Active + passive trinket combo. Tier set is Grim Jest's.",
    slots: {
      weapon:    { name: "Hungering Victory",                   source: "Vorasius" },
      offhand:   { name: "Farstrider's Mercy",                  source: "Crafting" },
      head:      { name: "Masquerade of the Grim Jest",         source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Eternal Voidsong Chain",              source: "Crown of the Cosmos" },
      shoulders: { name: "Venom Casks of the Grim Jest",        source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Rigid Scale Greatcloak",              source: "Skyreach" },
      chest:     { name: "Fantastic Finery of the Grim Jest",   source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Void-Skinned Bracers",                source: "Vorasius" },
      hands:     { name: "Sleight of Hand of the Grim Jest",    source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Silvermoon Agent's Utility Belt",     source: "Crafting" },
      legs:      { name: "Shaggy Wyrmleather Leggings",         source: "Pit of Saron" },
      feet:      { name: "Boots of Burning Focus",              source: "Skyreach" },
      finger1:   { name: "Platinum Star Band",                  source: "Algeth'ar Academy" },
      finger2:   { name: "Bifurcation Band",                   source: "Magister's Terrace" },
      trinket1:  { name: "Light Company Guidon",                source: "Imperator Averzian" },
      trinket2:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
    },
  },

  "elemental:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Belt and boots crafted. Cloak from Catalyst. Tier set is Primal Core.",
    slots: {
      weapon:    { name: "Excavating Cudgel",                   source: "Windrunner Spire" },
      offhand:   { name: "Ward of the Spellbreaker",            source: "Magister's Terrace" },
      head:      { name: "Locus of the Primal Core",            source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",         source: "Midnight Falls" },
      shoulders: { name: "Tempests of the Primal Core",         source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Guardian of the Primal Core",         source: "Tier Set — Raid | Catalyst | Vault" },
      chest:     { name: "Embrace of the Primal Core",          source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Fallen King's Cuffs",                 source: "Fallen-King Salhadaar" },
      hands:     { name: "Earthgrips of the Primal Core",       source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "World Tender's Barkclasp",            source: "Crafting" },
      legs:      { name: "Greaves of the Divine Guile",         source: "Nexus Point Xenas" },
      feet:      { name: "World Tender's Rootslippers",         source: "Crafting" },
      finger1:   { name: "Platinum Star Band",                  source: "Algeth'ar Academy" },
      finger2:   { name: "Sin'dorei Band of Hope",              source: "Belo'ren" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
      trinket2:  { name: "Emberwing Feather",                   source: "Windrunner Spire" },
    },
  },
  "enhancement:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Off hand (Farstrider's Chopper) is Blacksmithing crafted. Cloak is Tailoring crafted. Belt from Catalyst. Tier set is Primal Core.",
    slots: {
      weapon:    { name: "Clutchmates' Caress",                 source: "Vaelgor & Ezzorak" },
      offhand:   { name: "Farstrider's Chopper",               source: "Blacksmithing" },
      head:      { name: "Locus of the Primal Core",            source: "Catalyst | Raid | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",         source: "Midnight Falls" },
      shoulders: { name: "Tempests of the Primal Core",         source: "Catalyst | Raid | Vault" },
      back:      { name: "Adherent's Silken Shroud",           source: "Tailoring" },
      chest:     { name: "Embrace of the Primal Core",          source: "Catalyst | Raid | Vault" },
      wrist:     { name: "Fallen King's Cuffs",                 source: "Salhadaar" },
      hands:     { name: "Earthgrips of the Primal Core",       source: "Catalyst | Raid | Vault" },
      waist:     { name: "Ceinture of the Primal Core",         source: "Tier Set — Raid | Catalyst | Vault" },
      legs:      { name: "Eternal Flame Scaleguards",           source: "Belo'ren" },
      feet:      { name: "Whipcoil Sabatons",                   source: "Windrunner Spire" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      finger2:   { name: "Omission of Light",                  source: "Nexus-Point Xenas" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus (Raid)" },
      trinket2:  { name: "Algeth'ar Puzzle Box",                source: "Algeth'ar Academy" },
    },
  },
  "restoration-sham:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Two embellishment pieces vary by season stage. Special helm Oblivion Guise + full tier set + good secondary spread. Bracers from Catalyst.",
    slots: {
      weapon:    { name: "Weight of Command",                   source: "Imperator Averzian (Raid)" },
      offhand:   { name: "Reflux Reflector (Shield)",           source: "Nexus Point Xenas" },
      head:      { name: "Oblivion Guise",                      source: "Midnight Falls (Raid)" },
      neck:      { name: "Ribbon of Coiled Malice",             source: "Fallen-King Salhadaar (Raid)" },
      shoulders: { name: "Tempests of the Primal Core",         source: "Raid | Catalyst | Vault" },
      back:      { name: "Guardian of the Primal Core",         source: "Tier Set — Raid | Catalyst | Vault" },
      chest:     { name: "Embrace of the Primal Core",          source: "Raid | Catalyst | Vault" },
      wrist:     { name: "Cuffs of the Primal Core",            source: "Tier Set — Raid | Catalyst | Vault" },
      hands:     { name: "Earthgrips of the Primal Core",       source: "Raid | Catalyst | Vault" },
      waist:     { name: "Waistcord of the Judged",             source: "Lightblinded Vanguard (Raid)" },
      legs:      { name: "Leggings of the Primal Core",         source: "Raid | Catalyst | Vault" },
      feet:      { name: "Sabatons of Obscurement",             source: "Imperator Averzian (Raid)" },
      finger1:   { name: "Sin'dorei Band of Hope",              source: "Belo'ren (Raid)" },
      finger2:   { name: "Platinum Star Band",                  source: "Algeth'ar Academy" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus (Raid)" },
      trinket2:  { name: "Crucible of Erratic Energies",        source: "The Singularity" },
    },
  },

  "affliction:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Cloak (Adherent's Silken Shroud) and wrist (Martyr's Bindings) crafted. Tier set is Abyssal Immolator's.",
    slots: {
      weapon:    { name: "Belo'melorn, the Shattered Talon",    source: "Belo'ren" },
      offhand:   { name: "Grimoire of the Eternal Light",       source: "Vorasius" },
      head:      { name: "Abyssal Immolator's Smoldering Flames", source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Eternal Voidsong Chain",              source: "Crown of the Cosmos" },
      shoulders: { name: "Mantle of Dark Devotion",             source: "Windrunner Spire" },
      back:      { name: "Adherent's Silken Shroud",           source: "Crafting" },
      chest:     { name: "Abyssal Immolator's Dreadrobe",       source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Martyr's Bindings",                   source: "Crafted" },
      hands:     { name: "Abyssal Immolator's Grasps",          source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Whisper-Inscribed Sash",              source: "Belo'ren" },
      legs:      { name: "Abyssal Immolator's Pillars",         source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Slippers of the Midnight Flame",      source: "Vaelgor" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      finger2:   { name: "Occlusion of Void",                  source: "Nexus Point Xenas" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
      trinket2:  { name: "Emberwing Feather",                   source: "Windrunner Spire" },
    },
  },
  "demonology:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Same structure as Affliction but different trinkets. Cloak and wrist crafted. Tier set is Abyssal Immolator's.",
    slots: {
      weapon:    { name: "Belo'melorn, the Shattered Talon",    source: "Belo'ren" },
      offhand:   { name: "Grimoire of the Eternal Light",       source: "Vorasius" },
      head:      { name: "Abyssal Immolator's Smoldering Flames", source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Eternal Voidsong Chain",              source: "Crown of the Cosmos" },
      shoulders: { name: "Mantle of Dark Devotion",             source: "Windrunner Spire" },
      back:      { name: "Adherent's Silken Shroud",           source: "Crafting" },
      chest:     { name: "Abyssal Immolator's Dreadrobe",       source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Martyr's Bindings",                   source: "Crafted" },
      hands:     { name: "Abyssal Immolator's Grasps",          source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Whisper-Inscribed Sash",              source: "Belo'ren" },
      legs:      { name: "Abyssal Immolator's Pillars",         source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Slippers of the Midnight Flame",      source: "Vaelgor" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      finger2:   { name: "Occlusion of Void",                  source: "Nexus Point Xenas" },
      trinket1:  { name: "Emberwing Feather",                   source: "Windrunner Spire" },
      trinket2:  { name: "Locus-Walker's Ribbon",               source: "Crown of the Cosmos" },
    },
  },
  "destruction:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Cloak and wrist crafted. Tier set is Abyssal Immolator's.",
    slots: {
      weapon:    { name: "Belo'melorn, the Shattered Talon",    source: "Belo'ren" },
      offhand:   { name: "Grimoire of the Eternal Light",       source: "Vorasius" },
      head:      { name: "Abyssal Immolator's Smoldering Flames", source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Eternal Voidsong Chain",              source: "Crown of the Cosmos" },
      shoulders: { name: "Mantle of Dark Devotion",             source: "Windrunner Spire" },
      back:      { name: "Adherent's Silken Shroud",           source: "Crafting" },
      chest:     { name: "Abyssal Immolator's Dreadrobe",       source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Martyr's Bindings",                   source: "Crafted" },
      hands:     { name: "Abyssal Immolator's Grasps",          source: "Tier Set — Raid | Catalyst | Vault" },
      waist:     { name: "Whisper-Inscribed Sash",              source: "Belo'ren" },
      legs:      { name: "Abyssal Immolator's Pillars",         source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Slippers of the Midnight Flame",      source: "Vaelgor" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      finger2:   { name: "Occlusion of Void",                  source: "Nexus Point Xenas" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
      trinket2:  { name: "Vaelgor's Final Stare",               source: "Vaelgor" },
    },
  },

  "arms:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Cloak (Adherent's Silken Shroud) and bracers (Spellbreaker's Bracers) crafted. Belt from Catalyst. Tier set is Night Ender's.",
    slots: {
      weapon:    { name: "Alah'endal, the Dawnsong",            source: "Midnight Falls" },
      head:      { name: "Night Ender's Tusks",                 source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Ribbon of Coiled Malice",             source: "Fallen-King Salhadaar" },
      shoulders: { name: "Night Ender's Pauldrons",             source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Adherent's Silken Shroud",           source: "Crafted" },
      chest:     { name: "Night Ender's Breastplate",           source: "Chimaerus" },
      wrist:     { name: "Spellbreaker's Bracers",              source: "Crafted" },
      hands:     { name: "Embergrove Grasps",                   source: "Windrunner Spire" },
      waist:     { name: "Night Ender's Girdle",                source: "Tier Set — Raid | Catalyst | Vault" },
      legs:      { name: "Night Ender's Chausses",              source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Greaves of the Unformed",             source: "Chimaerus" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      finger2:   { name: "Occlusion of Void",                  source: "Nexus Point Xenas" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
      trinket2:  { name: "Heart of Ancient Hunger",             source: "Vorasius" },
    },
  },
  "fury:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Bracers (Spellbreaker's Bracers) and offhand (Blood Knight's Warblade) crafted. Belt and boots from Catalyst. Tier set is Night Ender's.",
    slots: {
      weapon:    { name: "Bellamy's Final Judgement",           source: "Lightblinded Vanguard" },
      offhand:   { name: "Blood Knight's Warblade",             source: "Crafted" },
      head:      { name: "Night Ender's Tusks",                 source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Amulet of the Abyssal Hymn",         source: "Midnight Falls" },
      shoulders: { name: "Night Ender's Pauldrons",             source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Rigid Scale Greatcloak",              source: "Skyreach" },
      chest:     { name: "Night Ender's Breastplate",           source: "Chimaerus" },
      wrist:     { name: "Spellbreaker's Bracers",              source: "Crafted" },
      hands:     { name: "Voidclaw Gauntlets",                  source: "Seat of the Triumvirate" },
      waist:     { name: "Night Ender's Girdle",                source: "Tier Set — Raid | Catalyst | Vault" },
      legs:      { name: "Night Ender's Chausses",              source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Night Ender's Greatboots",            source: "Tier Set — Raid | Catalyst | Vault" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      finger2:   { name: "Platinum Star Band",                  source: "Algeth'ar Academy" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
      trinket2:  { name: "Heart of Ancient Hunger",             source: "Vorasius" },
    },
  },
  "protection-war:Overall BiS": {
    patch: "12.0.1 Midnight Season 1", lastVerified: "2026-04-14", source: "Wowhead",
    crafting_note: "Aim for high haste. Tier set completion first, then trinkets. Avatar cooldown up frequently — trinket timing is flexible. Tier set is Night Ender's.",
    slots: {
      weapon:    { name: "Turalyon's False Echo",               source: "Crown of the Cosmos" },
      offhand:   { name: "Thalassian Dawnguard",               source: "Belo'ren" },
      head:      { name: "Night Ender's Tusks",                 source: "Tier Set — Raid | Catalyst | Vault" },
      neck:      { name: "Eternal Voidsong Chain",              source: "Crown of the Cosmos" },
      shoulders: { name: "Night Ender's Pauldrons",             source: "Tier Set — Raid | Catalyst | Vault" },
      back:      { name: "Draconic Nullcape",                   source: "Vaelgor & Ezzorak" },
      chest:     { name: "Night Ender's Breastplate",           source: "Tier Set — Raid | Catalyst | Vault" },
      wrist:     { name: "Light's March Bracers",               source: "Imperator Averzian" },
      hands:     { name: "Voidclaw Gauntlets",                  source: "Seat of the Triumvirate" },
      waist:     { name: "Ezzorak's Gloombind",                 source: "Vaelgor & Ezzorak" },
      legs:      { name: "Night Ender's Chausses",              source: "Tier Set — Raid | Catalyst | Vault" },
      feet:      { name: "Greaves of the Unformed",             source: "Chimaerus" },
      finger1:   { name: "Eye of Midnight",                     source: "Midnight Falls" },
      finger2:   { name: "Band of the Triumvirate",             source: "Seat of the Triumvirate" },
      trinket1:  { name: "Gaze of the Alnseer",                 source: "Chimaerus" },
      trinket2:  { name: "Heart of Ancient Hunger",             source: "Vorasius" },
    },
  },
};

function getSeeded(specId, content) {
  return SEEDED[`${specId}:${content}`] || SEEDED[`${specId}:Overall BiS`] || null;
}

const CLASSES = [
  {
    id:"death-knight", name:"Death Knight", color:"#C41E3A",
    roles:["Tank","DPS"], armor:"Plate",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"blood",    name:"Blood",  role:"Tank",      icon:"🩸"},
      {id:"frost-dk", name:"Frost",  role:"DPS", icon:"❄️"},
      {id:"unholy",   name:"Unholy", role:"DPS", icon:"💀"},
    ],
  },
  {
    id:"demon-hunter", name:"Demon Hunter", color:"#A330C9",
    roles:["Tank","DPS"], armor:"Leather",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"havoc",     name:"Havoc",     role:"DPS",  icon:"🟣"},
      {id:"vengeance", name:"Vengeance", role:"Tank",        icon:"🛡️"},
      {id:"devourer",  name:"Devourer",  role:"DPS", icon:"🌀",
       note:"New in Midnight — void-powered mid-range spellcaster, Intellect-based."},
    ],
  },
  {
    id:"druid", name:"Druid", color:"#FF7C0A",
    roles:["Tank","DPS","Healer"], armor:"Leather",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"balance",           name:"Balance",     role:"DPS", icon:"🌙"},
      {id:"feral",             name:"Feral",        role:"DPS",  icon:"🐾"},
      {id:"guardian",          name:"Guardian",     role:"Tank",        icon:"🐻"},
      {id:"restoration-druid", name:"Restoration",  role:"Healer",      icon:"🌿"},
    ],
  },
  {
    id:"evoker", name:"Evoker", color:"#33937F",
    roles:["DPS","Healer"], armor:"Mail",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"devastation",  name:"Devastation",  role:"DPS", icon:"🐉"},
      {id:"preservation", name:"Preservation", role:"Healer",      icon:"💚"},
      {id:"augmentation", name:"Augmentation", role:"DPS", icon:"✨"},
    ],
  },
  {
    id:"hunter", name:"Hunter", color:"#AAD372",
    roles:["DPS"], armor:"Mail",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"beast-mastery", name:"Beast Mastery", role:"DPS", icon:"🏹"},
      {id:"marksmanship",  name:"Marksmanship",  role:"DPS", icon:"🎯"},
      {id:"survival",      name:"Survival",       role:"DPS",  icon:"🗡️"},
    ],
  },
  {
    id:"mage", name:"Mage", color:"#3FC7EB",
    roles:["DPS"], armor:"Cloth",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"arcane",     name:"Arcane", role:"DPS", icon:"🔮"},
      {id:"fire",       name:"Fire",   role:"DPS", icon:"🔥"},
      {id:"frost-mage", name:"Frost",  role:"DPS", icon:"❄️"},
    ],
  },
  {
    id:"monk", name:"Monk", color:"#00FF98",
    roles:["Tank","DPS","Healer"], armor:"Leather",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"brewmaster", name:"Brewmaster", role:"Tank",      icon:"🍺"},
      {id:"mistweaver", name:"Mistweaver", role:"Healer",    icon:"🌊"},
      {id:"windwalker", name:"Windwalker", role:"DPS", icon:"🌬️"},
    ],
  },
  {
    id:"paladin", name:"Paladin", color:"#F48CBA",
    roles:["Tank","DPS","Healer"], armor:"Plate",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"holy-pala",       name:"Holy",        role:"Healer",    icon:"✨"},
      {id:"protection-pala", name:"Protection",  role:"Tank",      icon:"🛡️"},
      {id:"retribution",     name:"Retribution", role:"DPS", icon:"⚖️"},
    ],
  },
  {
    id:"priest", name:"Priest", color:"#E8E0D0",
    roles:["DPS","Healer"], armor:"Cloth",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"discipline",  name:"Discipline", role:"Healer",     icon:"🕊️"},
      {id:"holy-priest", name:"Holy",        role:"Healer",     icon:"☀️"},
      {id:"shadow",      name:"Shadow",      role:"DPS", icon:"🌑"},
    ],
  },
  {
    id:"rogue", name:"Rogue", color:"#FFF468",
    roles:["DPS"], armor:"Leather",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"assassination", name:"Assassination", role:"DPS", icon:"🗡️"},
      {id:"outlaw",        name:"Outlaw",         role:"DPS", icon:"☠️"},
      {id:"subtlety",      name:"Subtlety",       role:"DPS", icon:"🌑"},
    ],
  },
  {
    id:"shaman", name:"Shaman", color:"#0070DD",
    roles:["DPS","Healer"], armor:"Mail",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"elemental",        name:"Elemental",   role:"DPS", icon:"⚡"},
      {id:"enhancement",      name:"Enhancement", role:"DPS",  icon:"🌊"},
      {id:"restoration-sham", name:"Restoration", role:"Healer",     icon:"💧"},
    ],
  },
  {
    id:"warlock", name:"Warlock", color:"#8788EE",
    roles:["DPS"], armor:"Cloth",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"affliction",  name:"Affliction",  role:"DPS", icon:"👁️"},
      {id:"demonology",  name:"Demonology",  role:"DPS", icon:"😈"},
      {id:"destruction", name:"Destruction", role:"DPS", icon:"🔥"},
    ],
  },
  {
    id:"warrior", name:"Warrior", color:"#C69B3A",
    roles:["Tank","DPS"], armor:"Plate",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"arms",           name:"Arms",       role:"DPS", icon:"🗡️"},
      {id:"fury",           name:"Fury",       role:"DPS", icon:"💢"},
      {id:"protection-war", name:"Protection", role:"Tank",      icon:"🛡️"},
    ],
  },
];

const ROLE_COLOR    = {"Tank":"#60a5fa","Healer":"#4ade80","DPS":"#f87171"};
const ROLE_ICON     = {"Tank":"🛡️","Healer":"💚","DPS":"⚔️"};

const LEFT_SLOTS  = [
  {id:"head",      name:"Head"},
  {id:"neck",      name:"Neck"},
  {id:"shoulders", name:"Shoulders"},
  {id:"back",      name:"Back"},
  {id:"chest",     name:"Chest"},
  {id:"wrist",     name:"Wrist"},
];
const RIGHT_SLOTS = [
  {id:"hands",   name:"Hands"},
  {id:"waist",   name:"Waist"},
  {id:"legs",    name:"Legs"},
  {id:"feet",    name:"Feet"},
  {id:"finger1", name:"Finger 1"},
  {id:"finger2", name:"Finger 2"},
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@700&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0704;--bg2:#110d07;--panel:#150f08;
  --bdr:#2c1f0d;--bdr2:#3d2c10;
  --gold:#c9922a;--gold-lt:#e8b84b;--gold-br:#ffd04a;
  --parch:#f0deb4;--parch-dk:#c8a96a;--ink:#1a0c00;
  --crimson:#9b1a2a;--void:#6e40c9;
}
html{font-size:18px}
body{font-family:'Crimson Pro',Georgia,serif;font-size:1.05rem;background:var(--bg);color:var(--parch);min-height:100vh;line-height:1.6}
::-webkit-scrollbar{width:7px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--gold)}
.app{display:flex;flex-direction:column;min-height:100vh}

.hdr{background:linear-gradient(180deg,#000,var(--bg2));border-bottom:1px solid var(--bdr2);position:sticky;top:0;z-index:100}
.hdr-in{max-width:1280px;margin:0 auto;padding:.6rem 2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
.logo{display:flex;align-items:baseline;gap:.6rem;cursor:pointer;border:none;background:none;padding:0}
.logo-main{font-family:'Cinzel Decorative',serif;font-size:1.25rem;color:var(--gold-lt);text-shadow:0 0 20px rgba(201,146,42,.25)}
.logo-exp{font-family:'Cinzel',serif;font-size:.75rem;letter-spacing:.12em;color:var(--void);text-transform:uppercase}
.hdr-btns{display:flex;align-items:center;gap:.75rem}
.btn-site{font-family:'Cinzel',serif;font-size:.75rem;letter-spacing:.08em;padding:.4rem 1.1rem;background:transparent;border:1px solid var(--gold);color:var(--gold-lt);cursor:pointer;transition:all .18s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);text-decoration:none;display:inline-block}
.btn-site:hover{background:var(--gold);color:var(--ink)}
.btn-addon{font-family:'Cinzel',serif;font-size:.7rem;letter-spacing:.08em;padding:.38rem .9rem;background:rgba(201,146,42,.12);border:1px solid var(--gold);color:var(--gold-lt);text-decoration:none;transition:all .15s;white-space:nowrap;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);display:inline-block}.btn-addon:hover{background:var(--gold);color:var(--ink)}.btn-sup{font-family:'Cinzel',serif;font-size:.75rem;letter-spacing:.08em;padding:.4rem 1.1rem;background:rgba(155,26,42,.15);border:1px solid var(--crimson);color:#ff8fa0;cursor:pointer;transition:all .18s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);text-decoration:none;display:inline-block}
.btn-sup:hover{background:var(--crimson);color:#fff}

.hero{text-align:center;padding:3.5rem 2rem 2.5rem;position:relative;overflow:hidden;background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(110,64,201,.08),transparent 70%)}
.hero::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:60%;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.hero::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:80%;height:1px;background:linear-gradient(90deg,transparent,var(--bdr2),transparent)}

.hero-sub{font-family:'Crimson Pro',serif;font-style:italic;font-size:1.3rem;color:var(--parch-dk);margin-top:.5rem}
.hero-orn{color:var(--gold);font-size:1.2rem;opacity:.5;letter-spacing:.8rem;margin:.6rem 0}
.exp-badge{display:inline-flex;align-items:center;gap:.4rem;margin-top:.75rem;padding:.3rem 1rem;border:1px solid var(--void);background:rgba(110,64,201,.1);font-family:'Cinzel',serif;font-size:.78rem;letter-spacing:.1em;color:#a78bfa;text-transform:uppercase}

.main{max-width:1280px;margin:0 auto;padding:2rem;width:100%;flex:1}

.sh{font-family:'Cinzel',serif;font-size:.85rem;letter-spacing:.2em;color:var(--gold);text-transform:uppercase;display:flex;align-items:center;gap:.75rem;margin-bottom:1rem}
.sh::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,var(--bdr2),transparent)}

.role-strip{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.5rem}
.rpill{padding:.38rem 1rem;font-family:'Cinzel',serif;font-size:.78rem;letter-spacing:.06em;border:1px solid;cursor:pointer;transition:all .15s;background:transparent;clip-path:polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%);display:flex;align-items:center;gap:.35rem}

.class-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.7rem;margin-bottom:2.5rem}
.cc{background:var(--panel);border:1px solid var(--bdr);padding:1rem .75rem .85rem;cursor:pointer;transition:all .18s;text-align:center;position:relative;overflow:hidden}
.cc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--cc-color,var(--gold));transform:scaleX(0);transition:transform .18s}
.cc:hover{border-color:var(--cc-color,var(--gold));transform:translateY(-3px);box-shadow:0 6px 24px rgba(0,0,0,.5)}
.cc:hover::before{transform:scaleX(1)}
.cc-name{font-family:'Cinzel',serif;font-size:1rem;font-weight:600;letter-spacing:.04em;margin-bottom:.25rem}
.cc-specs{font-size:.7rem;opacity:.4;margin-top:.15rem}
.cc-dots{display:flex;justify-content:center;gap:3px;margin-top:.5rem}
.rdot{width:8px;height:8px;border-radius:50%}

.back{display:inline-flex;align-items:center;gap:.5rem;font-family:'Cinzel',serif;font-size:.82rem;letter-spacing:.08em;color:var(--gold);border:none;background:none;cursor:pointer;margin-bottom:1.5rem;transition:color .15s;padding:0}
.back:hover{color:var(--gold-br)}

.cbanner{padding:1.75rem 2rem;margin-bottom:1.5rem;border:1px solid;text-align:center;position:relative;background:linear-gradient(135deg,var(--panel) 0%,rgba(255,255,255,.02) 100%)}
.cbn{font-family:'Cinzel Decorative',serif;font-size:clamp(1.6rem,3vw,2.6rem);font-weight:700;letter-spacing:.06em}
.cbm{font-style:italic;opacity:.65;margin-top:.3rem;font-size:1rem}
.cnote{display:inline-block;margin-top:.6rem;padding:.2rem .8rem;background:rgba(201,146,42,.12);border:1px solid var(--gold);font-size:.8rem;color:var(--gold-lt);font-style:italic}

.spec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:.7rem;margin-bottom:1.5rem}
.sc{background:var(--panel);border:1px solid var(--bdr);padding:1.3rem 1rem;cursor:pointer;transition:all .18s;display:flex;flex-direction:column;align-items:center;gap:.45rem;text-align:center;position:relative}
.sc:hover,.sc.sel{border-color:var(--gold);background:rgba(201,146,42,.07)}
.sc.sel::after{content:'✓';position:absolute;top:.4rem;right:.5rem;color:var(--gold-br);font-size:.9rem}
.si{font-size:2.2rem}
.sn{font-family:'Cinzel',serif;font-size:1.05rem;font-weight:600;letter-spacing:.04em}
.sr{font-size:.73rem;padding:.18rem .6rem;clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)}
.snote{font-size:.73rem;font-style:italic;opacity:.65;margin-top:.15rem}

.sel-row{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.25rem}
.selbtn{display:flex;align-items:center;gap:.35rem;padding:.45rem 1rem;font-family:'Cinzel',serif;font-size:.78rem;letter-spacing:.06em;background:var(--panel);border:1px solid var(--bdr);color:var(--parch);cursor:pointer;transition:all .15s;clip-path:polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)}
.selbtn:hover,.selbtn.on{border-color:var(--gold);color:var(--gold-lt);background:rgba(201,146,42,.09)}

.open-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.65rem 1.75rem;font-family:'Cinzel',serif;font-size:.9rem;letter-spacing:.08em;background:var(--gold);border:none;color:var(--ink);cursor:pointer;transition:all .15s;font-weight:700;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)}
.open-btn:hover{background:var(--gold-br)}
.open-btn:disabled{opacity:.35;cursor:not-allowed}

.tracker{max-width:1000px;margin:0 auto}
.info-bar{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.25rem}
.ib{flex:1;min-width:100px;background:var(--panel);border:1px solid var(--bdr);padding:.5rem .75rem}
.ib-l{font-family:'Cinzel',serif;font-size:.62rem;letter-spacing:.12em;color:var(--gold);text-transform:uppercase;display:block;margin-bottom:.15rem}
.ib-v{font-size:.92rem;color:var(--parch)}


.bis-bar{background:rgba(110,64,201,.07);border:1px solid rgba(110,64,201,.3);padding:.75rem 1.25rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem}
.bis-txt{font-size:.88rem;color:var(--parch-dk);font-style:italic}
.bis-btn{font-family:'Cinzel',serif;font-size:.78rem;letter-spacing:.08em;padding:.4rem 1rem;background:rgba(110,64,201,.25);border:1px solid var(--void);color:#c4b5fd;cursor:pointer;transition:all .15s;clip-path:polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)}
.bis-btn:hover:not(:disabled){background:var(--void);color:#fff}
.bis-btn:disabled{opacity:.45;cursor:not-allowed}

.gear-grid{display:grid;grid-template-columns:1fr 1fr;gap:.55rem;margin-bottom:.55rem}
@media(max-width:660px){.gear-grid{grid-template-columns:1fr}}

.bis-mode-bar{display:flex;gap:0;border:1px solid var(--bdr);margin-bottom:.75rem;overflow:hidden}
.bis-mode-btn{flex:1;font-family:Cinzel,serif;font-size:.68rem;letter-spacing:.1em;padding:.45rem .5rem;background:transparent;border:none;color:var(--parch-dk);cursor:pointer;transition:all .15s;text-align:center}
.bis-mode-btn.active{background:rgba(201,146,42,.18);color:var(--gold-lt);box-shadow:inset 0 -2px 0 var(--gold)}
.bis-mode-btn:hover:not(.active){background:rgba(255,255,255,.04);color:var(--parch)}
.bis-mode-divider{width:1px;background:var(--bdr);flex-shrink:0}
.rank-block{background:var(--panel);border:1px solid var(--bdr);overflow:hidden;transition:border-color .15s;margin-bottom:.35rem}
.rank-block:last-child{margin-bottom:0}
.rank-block.rank-active{border-color:var(--gold)}
.rank-label{display:flex;align-items:center;gap:.5rem;padding:.2rem .5rem;background:rgba(0,0,0,.2);border-bottom:1px solid var(--bdr)}
.rank-badge{font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.1em;padding:.1rem .4rem;border:1px solid;opacity:.85}
.rank-badge.r1{color:#e8b84b;border-color:#e8b84b}
.rank-badge.r2{color:#aaa;border-color:#aaa}
.rank-badge.r3{color:#a0522d;border-color:#a0522d}
.rank-set-btn{margin-left:auto;font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.06em;padding:.12rem .45rem;background:rgba(201,146,42,.15);border:1px solid var(--bdr2);color:var(--gold);cursor:pointer;transition:all .12s}
.rank-set-btn:hover{background:rgba(201,146,42,.3)}
.rank-have{display:flex;align-items:center;gap:.3rem;font-family:Cinzel,serif;font-size:.58rem;color:var(--parch-dk);cursor:pointer;padding:.12rem .45rem;border:1px solid var(--bdr2);background:transparent;transition:all .12s;margin-left:.4rem}
.rank-have.done{color:#1EFF00;border-color:#1EFF00;background:rgba(30,255,0,.08)}
.rank-inputs{padding:.25rem .4rem .3rem}
.qe-banner{background:rgba(110,64,201,.1);border:1px solid rgba(110,64,201,.3);padding:.75rem;margin-bottom:.75rem;font-size:.85rem;color:var(--parch-dk);line-height:1.6}
.slot-wrap{display:flex;flex-direction:column;gap:.2rem}
.slot-lbl{font-family:'Cinzel',serif;font-size:.66rem;letter-spacing:.14em;color:var(--gold);text-transform:uppercase;padding-left:2px}
.slot-entry{display:flex;align-items:stretch}
.slot-fields{flex:1;background:var(--panel);border:1px solid var(--bdr);overflow:hidden;transition:border-color .15s}
.slot-fields:focus-within{border-color:var(--bdr2)}
.sf-name,.sf-src{display:block;width:100%;background:transparent;border:none;outline:none;font-family:'Crimson Pro',serif;color:var(--parch);padding:.42rem .65rem;transition:background .15s}
.sf-name{font-size:1rem}
.sf-name:focus{background:rgba(201,146,42,.05)}
.sf-src{font-size:.85rem;color:var(--parch-dk);border-top:1px solid var(--bdr);font-style:italic}
.sf-src:focus{background:rgba(201,146,42,.03)}
input::placeholder{color:rgba(240,222,180,.22);font-style:italic}
.slot-chk{width:38px;flex-shrink:0;background:var(--panel);border:1px solid var(--bdr);border-left:none;display:flex;align-items:center;justify-content:center;cursor:pointer;clip-path:polygon(0 0,calc(100% - 11px) 0,100% 50%,calc(100% - 11px) 100%,0 100%);transition:background .15s;font-size:1.05rem;color:transparent;user-select:none}
.slot-chk:hover{background:rgba(201,146,42,.1)}
.slot-chk.done{background:rgba(201,146,42,.2);color:var(--gold-br)}

.sub-sh{font-family:'Cinzel',serif;font-size:.75rem;letter-spacing:.16em;color:var(--parch-dk);text-transform:uppercase;opacity:.65;margin:1rem 0 .55rem;display:flex;align-items:center;gap:.5rem}
.sub-sh::after{content:'';flex:1;height:1px;background:var(--bdr)}

.sug-panel{margin-top:1rem;background:var(--panel);border:1px solid var(--bdr);max-height:450px;overflow-y:auto}
.sug-head{position:sticky;top:0;background:var(--panel);padding:.85rem 1rem;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;gap:.75rem;flex-wrap:wrap}
.sug-title{font-family:'Cinzel',serif;font-size:.85rem;letter-spacing:.1em;color:var(--gold);text-transform:uppercase}
.sug-warn{font-size:.75rem;color:rgba(251,191,36,.7);font-style:italic;padding:.5rem 1rem;border-bottom:1px solid var(--bdr)}
.sug-craft{padding:.6rem 1rem;border-bottom:1px solid var(--bdr);background:rgba(201,146,42,.06);font-size:.82rem;color:var(--parch-dk)}
.sug-craft-lbl{font-family:'Cinzel',serif;font-size:.7rem;color:var(--gold);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:.2rem}
.sug-item{padding:.65rem 1rem;border-bottom:1px solid rgba(44,31,13,.5)}
.sug-item:last-child{border-bottom:none}
.sug-slot{font-family:'Cinzel',serif;font-size:.68rem;color:var(--gold);text-transform:uppercase;letter-spacing:.08em}
.sug-name{color:var(--parch);margin-top:.08rem;font-size:.9rem}
.sug-src{color:var(--parch-dk);font-style:italic;font-size:.78rem}
.apply-one{margin-top:.3rem;font-family:'Cinzel',serif;font-size:.68rem;letter-spacing:.06em;padding:.18rem .55rem;background:transparent;border:1px solid var(--gold);color:var(--gold);cursor:pointer;transition:all .13s;clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)}
.apply-one:hover{background:var(--gold);color:var(--ink)}

.tactions{display:flex;justify-content:flex-end;gap:.6rem;flex-wrap:wrap;margin-top:1.25rem}
.tbtn{font-family:'Cinzel',serif;font-size:.82rem;letter-spacing:.07em;padding:.55rem 1.4rem;cursor:pointer;transition:all .15s;clip-path:polygon(9px 0%,100% 0%,calc(100% - 9px) 100%,0% 100%);border:1px solid}
.tbtn.pri{background:var(--gold);border-color:var(--gold);color:var(--ink);font-weight:700}
.tbtn.pri:hover{background:var(--gold-br)}
.tbtn.sec{background:transparent;border-color:var(--gold);color:var(--gold-lt)}
.tbtn.sec:hover{background:rgba(201,146,42,.1)}
.tbtn.dan{background:transparent;border-color:var(--crimson);color:#ff8fa0}
.tbtn.dan:hover{background:rgba(155,26,42,.2)}

.ftr{border-top:1px solid var(--bdr);padding:1.25rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;font-size:.78rem;color:var(--parch-dk);opacity:.6}

.spin{display:inline-block;width:16px;height:16px;border:2px solid rgba(167,139,250,.2);border-top-color:#a78bfa;border-radius:50%;animation:rot .75s linear infinite;vertical-align:middle;margin-right:.4rem}
@keyframes rot{to{transform:rotate(360deg)}}
.fade{animation:fadeup .25s ease}
@keyframes fadeup{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

@media print {
  @page { margin: 1.2cm; size: A4; }
  :root {
    --parch: #000; --parch-dk: #333; --gold: #444; --gold-lt: #000;
    --bg: #fff; --bg2: #fff; --panel: #fff; --bdr: #bbb; --bdr2: #aaa;
    --crimson: #333; --void: #333; --ink: #000;
  }
  .hdr, .hero, .bis-bar, .bis-mode-bar, .tactions, .back, .sug-panel, .ftr, .farm-priority-section, .no-print, [data-noprint] { display: none !important; }
  body, html, .app { background: #fff !important; }
  body { color: #000 !important; }
  * { background: transparent !important; box-shadow: none !important; text-shadow: none !important; clip-path: none !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .tracker { max-width: 100%; }
  .info-bar { display: flex !important; flex-wrap: wrap; gap: .4rem; margin-bottom: .8rem; border: 1px solid #aaa !important; padding: .4rem; }
  .ib { flex: 1; min-width: 80px; border: none !important; padding: .2rem .4rem; }
  .ib-l { font-size: .58rem !important; color: #666 !important; display: block; letter-spacing: .1em; text-transform: uppercase; font-family: Cinzel, serif; }
  .ib-v { font-size: .85rem !important; color: #000 !important; font-weight: 600; }
  .gear-grid { display: grid !important; grid-template-columns: 1fr 1fr; gap: .3rem; }
  .slot-wrap { break-inside: avoid; margin-bottom: .2rem; }
  .slot-lbl { font-size: .58rem !important; color: #555 !important; letter-spacing: .1em; text-transform: uppercase; font-family: Cinzel, serif; padding-left: 2px; display: block; margin-bottom: 1px; }
  .slot-entry { display: flex !important; border: 1px solid #aaa !important; }
  .slot-fields { flex: 1; }
  .sf-name { font-size: .88rem !important; color: #000 !important; padding: .28rem .4rem; display: block; border-bottom: 1px solid #ddd !important; }
  .sf-src { font-size: .72rem !important; color: #444 !important; padding: .2rem .4rem; display: block; font-style: italic; }
  .slot-chk { width: 26px; flex-shrink: 0; border-left: 1px solid #aaa !important; display: flex !important; align-items: center; justify-content: center; font-size: 1rem; }
  .slot-chk:not(.done) { color: transparent !important; }
  .slot-chk.done { color: #000 !important; }
  .slot-chk.soft { color: #000 !important; background: rgba(232,184,75,.15) !important; }
  .sub-sh { font-size: .65rem !important; color: #555 !important; letter-spacing: .15em; text-transform: uppercase; font-family: Cinzel, serif; border-bottom: 1px solid #ccc !important; padding-bottom: .2rem; margin: .6rem 0 .3rem; display: block !important; }
  input { color: #000 !important; }
}
`;

function parseSimCVaultItems(str) {
  const items = [];
  const lines = str.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  let inVault = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "### Weekly Reward Choices") { inVault = true; continue; }
    if (trimmed === "### End of Weekly Reward Choices") break;
    if (!inVault) continue;
    // Lines look like: # Item Name (ilvl)
    const m = trimmed.match(/^#\s+(.+?)\s+\((\d+)\)\s*$/);
    if (m) {
      const name = m[1].trim();
      const ilvl = parseInt(m[2]);
      const track = ilvl >= 276 ? "Myth" : ilvl >= 259 ? "Hero" : ilvl >= 246 ? "Champion" : ilvl >= 233 ? "Veteran" : null;
      items.push({ name, ilvl, track });
    }
  }
  return items;
}

async function parseSimC(str) {
  const SIMC_TO_SLOT = {
    head:"head", neck:"neck", shoulder:"shoulders", back:"back",
    chest:"chest", wrist:"wrist", hands:"hands", waist:"waist",
    legs:"legs", feet:"feet", finger1:"finger1", finger2:"finger2",
    trinket1:"trinket1", trinket2:"trinket2",
    main_hand:"mainhand", off_hand:"offhand",
  };
  const result = {};
  const idLookups = [];
  const lines = str.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    for (const [simcKey, ourKey] of Object.entries(SIMC_TO_SLOT)) {
      const prefix = simcKey + "=";
      if (!trimmed.toLowerCase().startsWith(prefix)) continue;
      const afterEq = trimmed.slice(prefix.length);
      const parts = afterEq.split(",");
      const rawName = parts[0].trim();
      const ilvlPart = parts.find(p => p.trim().startsWith("item_level="));
      const detectedIlvl = ilvlPart ? parseInt(ilvlPart.trim().slice(11)) : null;
      const detectedTrack = detectedIlvl ? (
        detectedIlvl >= 276 ? "Myth" :
        detectedIlvl >= 259 ? "Hero" :
        detectedIlvl >= 246 ? "Champion" :
        detectedIlvl >= 233 ? "Veteran" : null
      ) : null;
      if (rawName && rawName !== "") {
        const name = rawName.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()).trim();
        if (name) {
          result[ourKey] = name;
          if (detectedTrack) result[ourKey + "_track"] = detectedTrack;
        }
      } else {
        const idPart = parts.find(p => p.trim().startsWith("id="));
        if (idPart) { idLookups.push({ slot: ourKey, id: idPart.trim().slice(3), track: detectedTrack }); }
      }
      break;
    }
  }
  if (idLookups.length > 0) {
    await Promise.allSettled(idLookups.map(async ({ slot, id }) => {
      try {
        const r = await fetch(`https://nether.wowhead.com/tooltip/item/${id}?json`);
        const j = await r.json();
        if (j.name) { result[slot] = j.name; }
        else result[slot] = `Item #${id}`;
      } catch { result[slot] = `Item #${id}`; }
    }));
  }
  return result;
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isBiSMatch(worn, bis) {
  if (!worn || !bis) return false;
  const w = normalize(worn);
  const b = normalize(bis);
  return w === b || b.startsWith(w) || w.startsWith(b) || (w.length > 6 && b.includes(w)) || (b.length > 6 && w.includes(b));
}


const TRACKS = ["", "Veteran", "Champion", "Hero", "Myth"];
const TRACK_COLOR = { "Veteran":"#1EFF00", "Champion":"#0070DD", "Hero":"#A335EE", "Myth":"#FF8000" };

const GLOBAL_TRACK_ORDER = ["Veteran","Champion","Hero","Myth"];

function Slot({ label, id, data, onChange, targetTrack, bisMode }) {
  const d = data[id] || {};
  const up = (f, v) => onChange(id, { ...d, [f]: v });
  const track = d.track || "";
  const softBisSlot = d.done && track && targetTrack &&
    GLOBAL_TRACK_ORDER.indexOf(track) < GLOBAL_TRACK_ORDER.indexOf(targetTrack);

  if (bisMode === "custom") {
    const ranks = d.ranks || [{name:"",src:""},{name:"",src:""},{name:"",src:""}];
    const activeRank = d.activeRank ?? 0;
    const upRank = (idx, field, val) => {
      const nr = [...ranks];
      nr[idx] = { ...nr[idx], [field]: val };
      onChange(id, { ...d, ranks: nr, name: nr[activeRank]?.name || "", src: nr[activeRank]?.src || "" });
    };
    const setActive = (idx) => {
      onChange(id, { ...d, activeRank: idx, name: ranks[idx]?.name || "", src: ranks[idx]?.src || "" });
    };
    const toggleHave = (idx) => {
      const nr = [...ranks];
      nr[idx] = { ...nr[idx], have: !nr[idx]?.have };
      onChange(id, { ...d, ranks: nr });
    };
    const RBADGE = ["r1","r2","r3"];
    const RLABEL = ["BiS","Alt 1","Alt 2"];
    return (
      <div className="slot-wrap">
        <div className="slot-lbl">{label}</div>
        {ranks.map((r, idx) => (
          <div key={idx} className={"rank-block" + (idx === activeRank ? " rank-active" : "")}>
            <div className="rank-label">
              <span className={"rank-badge " + RBADGE[idx]}>{RLABEL[idx]}</span>
              {idx !== activeRank && r.name && (
                <button className="rank-set-btn" onClick={() => setActive(idx)}>Set as target</button>
              )}
              {idx === activeRank && r.name && (
                <span style={{ fontSize:".6rem", color:"var(--gold)", marginLeft:"auto", fontFamily:"Cinzel,serif", letterSpacing:".06em" }}>▸ targeting</span>
              )}
              {r.name && (
                <button className={"rank-have" + (r.have ? " done" : "")} onClick={() => toggleHave(idx)}>
                  {r.have ? "✓ have" : "have?"}
                </button>
              )}
            </div>
            <div className="rank-inputs">
              <input className="sf-name" placeholder={`Rank ${idx+1} item name...`} value={r.name || ""} onChange={e => upRank(idx, "name", e.target.value)} style={{ marginBottom:".2rem" }} />
              <input className="sf-src" placeholder="Source..." value={r.src || ""} onChange={e => upRank(idx, "src", e.target.value)} />
            </div>
          </div>
        ))}
        {d.name && (
          <div style={{ display:"flex", gap:".25rem", padding:".2rem .4rem", background:"rgba(0,0,0,.15)", border:"1px solid var(--bdr)", borderTop:"none" }}>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:".58rem", color:"var(--parch-dk)", alignSelf:"center", letterSpacing:".06em" }}>TRACK:</span>
            {TRACKS.filter(t => t).map(t => (
              <button key={t} onClick={() => up("track", track === t ? "" : t)} style={{ fontFamily:"Cinzel,serif", fontSize:".58rem", letterSpacing:".05em", padding:".1rem .4rem", background: track === t ? TRACK_COLOR[t] : "transparent", border:`1px solid ${track === t ? TRACK_COLOR[t] : "var(--bdr2)"}`, color: track === t ? "#fff" : "var(--parch-dk)", cursor:"pointer", transition:"all .12s", filter: track === t ? "brightness(0.72)" : "none" }}>{t}</button>
            ))}
            <div className={"slot-chk" + (d.done && !softBisSlot ? " done" : d.done && softBisSlot ? " soft" : "")} onClick={() => up("done", !d.done)} title={d.done ? "Acquired" : "Mark acquired"} style={{ marginLeft:"auto", width:"28px", height:"28px", fontSize:".85rem" }}>
              {d.done ? (softBisSlot ? "~" : "✓") : ""}
            </div>
          </div>
        )}
        {track && <div style={{ height:"2px", background: TRACK_COLOR[track], opacity:.7 }} />}
      </div>
    );
  }

  return (
    <div className="slot-wrap">
      <div className="slot-lbl">{label}</div>
      <div className="slot-entry">
        <div className="slot-fields">
          <input className="sf-name" placeholder="Item name..." value={d.name || ""} onChange={e => up("name", e.target.value)} />
          <input className="sf-src" placeholder="Source — Raid / Dungeon / Crafted..." value={d.src || ""} onChange={e => up("src", e.target.value)} />
          <div className="slot-track-row" style={{ display:"flex", gap:".25rem", padding:".2rem .5rem", borderTop:"1px solid var(--bdr)", background:"rgba(0,0,0,.15)" }}>
            {TRACKS.filter(t => t).map(t => (
              <button key={t} data-selected={track === t ? "true" : "false"} onClick={() => up("track", track === t ? "" : t)} style={{ fontFamily:"Cinzel,serif", fontSize:".6rem", letterSpacing:".05em", padding:".12rem .45rem", background: track === t ? TRACK_COLOR[t] : "transparent", border:`1px solid ${track === t ? TRACK_COLOR[t] : "var(--bdr2)"}`, color: track === t ? "#fff" : "var(--parch-dk)", fontWeight: track === t ? 700 : 400, cursor:"pointer", transition:"all .12s", filter: track === t ? "brightness(0.72)" : "none", textShadow: track === t ? "0 1px 2px rgba(0,0,0,.5)" : "none" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className={"slot-chk" + (d.done && !softBisSlot ? " done" : d.done && softBisSlot ? " soft" : "")}
          onClick={() => up("done", !d.done)}
          title={d.done ? (softBisSlot ? "Soft BiS — set track above to mark progress" : "Acquired") : "Click to mark acquired"}>
          {d.done ? (softBisSlot ? "~" : "✓") : ""}
        </div>
      </div>
      {track && (
        <div style={{ height:"2px", background: TRACK_COLOR[track], opacity:.7 }} />
      )}
    </div>
  );
}

function Tracker({ cls, spec, charName, onBack }) {
  const storageKey = `bis-${cls.id}-${spec.id}-${charName || "default"}`;
  const modeStorageKey = (mode) => `${storageKey}-${mode}`;
  const readModeData = (mode) => {
    try {
      const modeKey = modeStorageKey(mode);
      const modeRaw = localStorage.getItem(modeKey);
      if (modeRaw) return JSON.parse(modeRaw) || {};
      const baseRaw = localStorage.getItem(storageKey);
      return baseRaw ? JSON.parse(baseRaw) : {};
    } catch {
      return {};
    }
  };

  const [data,    setData]    = useState(() => {
    try {
      const savedMode = localStorage.getItem(`bismode-${storageKey}`) || "community";
      return readModeData(savedMode);
    } catch { return {}; }
  });
  const [wMode,   setWMode]   = useState(() => {
    try {
      const savedMode = localStorage.getItem(`bismode-${storageKey}`) || "community";
      const d = readModeData(savedMode);
      if (d.mainhand || d.offhand) return "1h";
    } catch {}
    return "2h";
  });
  const [loading, setLoading] = useState(false);
  const [sugs,    setSugs]    = useState(null);
  const [showPriority, setShowPriority] = useState(false);
  const [showSimC, setShowSimC] = useState(false);
  const [targetTrack, setTargetTrack] = useState(() => {
    try { return localStorage.getItem(`target-track-${storageKey}`) || "Myth"; } catch { return "Myth"; }
  });

  const TRACK_ORDER = ["Veteran","Champion","Hero","Myth"];
  const trackRank = t => TRACK_ORDER.indexOf(t);
  const meetsTarget = d => {
    if (!d?.done) return false;
    if (!d?.track) return true;
    return trackRank(d.track) >= trackRank(targetTrack);
  };
  const softBis = d => d?.done && d?.track && trackRank(d.track) < trackRank(targetTrack);
  const [bisMode, setBisMode] = useState(() => {
    try { return localStorage.getItem(`bismode-${storageKey}`) || "community"; } catch { return "community"; }
  });
  const switchBisMode = (m) => {
    try {
      localStorage.setItem(modeStorageKey(bisMode), JSON.stringify(data || {}));
      localStorage.setItem(`bismode-${storageKey}`, m);
    } catch {}
    const next = readModeData(m);
    setBisMode(m);
    setData(next);
    setWMode(next.mainhand || next.offhand ? "1h" : "2h");
  };
  const [simcStr, setSimcStr] = useState(() => {
    try { return localStorage.getItem(`simc-${storageKey}`) || ""; } catch { return ""; }
  });
  const [vaultMatches, setVaultMatches] = useState([]);
  const sugRef = useRef(null);

  const SLOT_LABELS = {
    head:"Head", neck:"Neck", shoulders:"Shoulders", back:"Cloak",
    chest:"Chest", wrist:"Wrist", hands:"Hands", waist:"Belt",
    legs:"Legs", feet:"Boots", finger1:"Ring 1", finger2:"Ring 2",
    trinket1:"Trinket 1", trinket2:"Trinket 2",
    weapon:"Weapon", offhand:"Off Hand", mainhand:"Main Hand", weapon2h:"2H Weapon",
  };

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      localStorage.setItem(modeStorageKey(bisMode), JSON.stringify(data));
    } catch {}
  }, [data, storageKey, bisMode]);

  const upSlot = useCallback((id, val) => {
    setData(p => {
      const next = { ...p, [id]: val };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [storageKey]);

  const can2h = cls.weapons.includes("2H Weapon");
  const can1h = cls.weapons.includes("Main Hand + Off Hand");

  const mapKey = (k, slots) => {
    if (k === "weapon") {
      if (slots.offhand) return "mainhand";
      return can2h ? "weapon2h" : "mainhand";
    }
    return k;
  };

  const scrollToSugs = () => setTimeout(() => sugRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 80);

  const ADDON_SLOT_MAP = {
    head:"1", neck:"2", shoulders:"3", back:"15",
    chest:"5", wrist:"9", hands:"10", waist:"6",
    legs:"7", feet:"8", finger1:"11", finger2:"12",
    trinket1:"13", trinket2:"14",
    weapon2h:"16", mainhand:"16", offhand:"17"
  };

  const exportForAddon = () => {
    const cleanField = (v) => (v || "").replace(/[|:\^~#]/g, " ").trim();
    const parts = [];
    allSlotIds.forEach(id => {
      const d = data[id];
      const slotNum = ADDON_SLOT_MAP[id];
      if (!slotNum) return;
      let itemName = d?.name;
      let itemSrc = d?.src;
      let rankBlob = "";
      let activeIdx = 0;
      if (bisMode === "custom" && d?.ranks) {
        activeIdx = d.activeRank ?? 0;
        itemName = d.ranks[activeIdx]?.name || d.name;
        itemSrc = d.ranks[activeIdx]?.src || d.src;
        const ranked = d.ranks
          .map(r => ({
            name: cleanField(r?.name),
            src: cleanField(r?.src || "Unknown"),
            have: r?.have ? "1" : "0",
          }))
          .filter(r => r.name);
        if (ranked.length) {
          rankBlob = "#T" + String(activeIdx + 1) + "#" + ranked.map(r => [r.name, r.src, r.have].join("~")).join("^");
        }
      }
      if (itemName) {
        const s = cleanField(itemSrc || "Unknown");
        const n = cleanField(itemName);
        const acquired = d.done ? "1" : "0";
        const trackCode = d.track ? d.track[0].toLowerCase() : "n";
        parts.push(slotNum + ":" + n + ":" + s + ":" + acquired + ":" + trackCode + rankBlob);
      }
    });
    if (!parts.length) return null;
    return `WBISMODE=${bisMode};` + parts.join("|");
  };

  const loadSuggestions = async () => {
    const seed = getSeeded(spec.id, "Overall BiS");
    if (seed) {
      setSugs(seed);
      if (seed.slots?.offhand) setWMode("1h");
      scrollToSugs();
      return;
    }
    setLoading(true); setSugs(null);
    try {
      const r = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specId: spec.id, specName: spec.name, className: cls.name, role: spec.role }),
      });
      const j = await r.json();
      const result = !j.error && j.slots ? j : { error: true };
      setSugs(result);
      if (result.slots?.offhand) setWMode("1h");
      scrollToSugs();
    } catch { setSugs({ error: true }); }
    setLoading(false);
  };

  const applyAll = () => {
    if (!sugs?.slots) return;
    const nd = {};
    Object.entries(sugs.slots).forEach(([k, v]) => {
      const mapped = mapKey(k, sugs.slots);
      nd[mapped] = { name: v.name, src: v.source, done: false };
    });
    setData(nd);
    try { localStorage.setItem(storageKey, JSON.stringify(nd)); } catch {}
    setSugs(null);
  };

  const applyOne = (k, v) => {
    const mapped = mapKey(k, sugs?.slots || {});
    setData(p => {
      const next = { ...p, [mapped]: { name: v.name, src: v.source, done: false } };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const allSlotIds = [
    ...LEFT_SLOTS.map(s => s.id), ...RIGHT_SLOTS.map(s => s.id),
    ...(can2h && (!can1h || wMode === "2h") ? ["weapon2h"] : []),
    ...(can1h && (!can2h || wMode === "1h") ? ["mainhand","offhand"] : []),
    "trinket1","trinket2"
  ];
  const filled    = allSlotIds.filter(id => data[id]?.name);
  const acquired  = allSlotIds.filter(id => meetsTarget(data[id]));
  const softAcq   = allSlotIds.filter(id => softBis(data[id]));
  const pct       = allSlotIds.length ? Math.round(acquired.length / allSlotIds.length * 100) : 0;

  const farmPriority = () => {
    const needed = {};
    allSlotIds.forEach(id => {
      const d = data[id];
      let itemName = d?.name;
      let itemSrc = d?.src;
      if (bisMode === "custom" && d?.ranks) {
        const activeIdx = d.activeRank ?? 0;
        itemName = d.ranks[activeIdx]?.name || d.name;
        itemSrc = d.ranks[activeIdx]?.src || d.src;
      }
      if (itemName && !meetsTarget(d)) {
        const src = itemSrc || "Unknown";
        if (!needed[src]) needed[src] = [];
        const isSoft = softBis(data[id]);
        needed[src].push({ slot: SLOT_LABELS[id] || id, item: itemName, soft: isSoft, track: d.track || null });
      }
    });
    return Object.entries(needed).sort((a, b) => b[1].length - a[1].length);
  };

  return (
    <div className="tracker fade">
      <button className="back" onClick={onBack}>← Back to {cls.name}</button>

      <div className="info-bar">
        {[["Class", cls.name], ["Spec", spec.name], ["Role", spec.role], ...(charName && charName !== "default" ? [["Character", charName]] : [])].map(([l, v]) => (
          <div className="ib" key={l}><span className="ib-l">{l}</span><span className="ib-v">{v}</span></div>
        ))}
        <div className="ib">
          <span className="ib-l">True BiS ({targetTrack})</span>
          <span className="ib-v">{acquired.length}/{allSlotIds.length} · {pct}%</span>
        </div>
        {softAcq.length > 0 && (
          <div className="ib">
            <span className="ib-l" style={{ color:"#e8b84b" }}>Soft BiS</span>
            <span className="ib-v" style={{ color:"#e8b84b" }}>{softAcq.length} upgrading</span>
          </div>
        )}
      </div>

      {filled.length > 0 && (
        <div className="farm-priority-section no-print" style={{ background:"var(--panel)", border:"1px solid var(--bdr)", marginBottom:".75rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:".75rem", padding:".6rem .75rem", borderBottom: showPriority ? "1px solid var(--bdr)" : "none" }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:".3rem", flexWrap:"wrap" }}>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".12em", color:"var(--gold)" }}>FARM PRIORITY</span>
                <span style={{ fontSize:".72rem", color:"var(--parch-dk)", fontStyle:"italic" }}>know exactly what to run this week</span>
                <div style={{ display:"flex", gap:".25rem", marginLeft:"auto" }}>
                  <span style={{ fontSize:".65rem", color:"var(--parch-dk)", alignSelf:"center" }}>Target:</span>
                  {["Veteran","Champion","Hero","Myth"].map(t => (
                    <button key={t} onClick={() => { setTargetTrack(t); try { localStorage.setItem(`target-track-${storageKey}`, t); } catch {} }} style={{ fontFamily:"Cinzel,serif", fontSize:".6rem", letterSpacing:".03em", padding:".1rem .35rem", background: targetTrack === t ? TRACK_COLOR[t] : "transparent", border:`1px solid ${targetTrack === t ? TRACK_COLOR[t] : "var(--bdr2)"}`, color: targetTrack === t ? "#fff" : "var(--parch-dk)", cursor:"pointer", filter: targetTrack === t ? "brightness(0.75)" : "none", transition:"all .12s" }}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{ background:"var(--bdr)", height:"5px", position:"relative", borderRadius:"0" }}>
                <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:`hsl(${pct * 1.2},65%,50%)`, transition:"width .4s" }} />
              </div>
              <div style={{ fontSize:".7rem", color:"var(--parch-dk)", marginTop:".25rem" }}>{acquired.length} of {allSlotIds.length} BiS slots acquired · {pct}%</div>
            </div>
            <div style={{ display:"flex", gap:".4rem", flexShrink:0 }}>
              <button onClick={() => setShowPriority(p => !p)} style={{ fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".06em", padding:".35rem .85rem", background: showPriority ? "var(--gold)" : "transparent", border:"1px solid var(--gold)", color: showPriority ? "var(--ink)" : "var(--gold)", cursor:"pointer", transition:"all .15s" }}>
                {showPriority ? "▲ Hide" : "▼ Show"}
              </button>
              <button onClick={() => {
                const w = window.open("","_blank");
                const farmRows = farmPriority();
                const charLabel = charName && charName !== "default" ? charName + " — " : "";
                const rowsHtml = farmRows.map(([src,items]) =>
                  `<h2>${src}</h2>${items.map(i=>`<p>&#8226; ${i.slot}: ${i.item}${i.soft ? ` <em>(upgrading from ${i.track})</em>` : ""}</p>`).join("")}`
                ).join("");
                w.document.write(`<!DOCTYPE html><html><head><title>${charLabel}${cls.name} ${spec.name} Farm Priority</title><style>body{font-family:Georgia,serif;max-width:680px;margin:2rem auto;color:#1a0c00;}h1{font-family:serif;font-size:1.1rem;border-bottom:2px solid #c9922a;padding-bottom:.4rem;}h2{font-size:.9rem;color:#c9922a;margin:.8rem 0 .2rem;font-family:serif;}p{margin:.15rem 0;font-size:.85rem;}.meta{font-size:.72rem;color:#888;}@media print{body{margin:.5in;}}</style></head><body><h1>${charLabel}${cls.name} ${spec.name} — Farm Priority</h1><p class="meta">Midnight Season 1 &middot; Target: ${targetTrack} &middot; ${new Date().toLocaleDateString()}</p>${rowsHtml}<p class="meta" style="margin-top:2rem;border-top:1px solid #ddd;padding-top:.4rem;">wowbistracker.com</p></body></html>`);
                w.document.close(); w.print();
              }} style={{ fontFamily:"Cinzel,serif", fontSize:".68rem", letterSpacing:".04em", padding:".35rem .7rem", background:"transparent", border:"1px solid var(--bdr2)", color:"var(--parch-dk)", cursor:"pointer", transition:"all .15s", whiteSpace:"nowrap" }}>
                🖨 Print Farm List
              </button>
              <button onClick={() => window.open("https://wowbistracker.com/#group-planner", "_blank")} style={{ fontFamily:"Cinzel,serif", fontSize:".68rem", letterSpacing:".04em", padding:".35rem .7rem", background:"transparent", border:"1px solid var(--bdr2)", color:"var(--parch-dk)", cursor:"pointer", transition:"all .15s", whiteSpace:"nowrap" }} title="Open Group Farm Planner in a new tab">
                👥 Plan with group
              </button>
            </div>
          </div>
          {showPriority && (
            <div style={{ padding:".75rem" }}>
              {farmPriority().length === 0 ? (
                <div style={{ fontSize:".88rem", color:"var(--gold-lt)", fontStyle:"italic", textAlign:"center", padding:".5rem" }}>🎉 All BiS items acquired!</div>
              ) : (
                farmPriority().map(([src, items]) => (
                  <div key={src} style={{ marginBottom:".6rem", paddingBottom:".6rem", borderBottom:"1px solid var(--bdr)" }}>
                    <div style={{ display:"flex", alignItems:"baseline", gap:".5rem", marginBottom:".3rem" }}>
                      <span style={{ color:"var(--gold-lt)", fontFamily:"Cinzel,serif", fontSize:".8rem" }}>{src}</span>
                      <span style={{ background:"var(--crimson)", color:"#fff", fontSize:".65rem", fontFamily:"Cinzel,serif", padding:".05rem .4rem" }}>{items.length} needed</span>
                    </div>
                    {items.map(({slot, item}) => (
                      <div key={slot} style={{ fontSize:".85rem", color:"var(--parch-dk)", paddingLeft:".75rem", marginBottom:".15rem" }}>
                        <span style={{ color:"var(--parch-dk)", fontSize:".75rem", textTransform:"uppercase", fontFamily:"Cinzel,serif", letterSpacing:".05em" }}>{slot}</span>
                        {" · "}
                        <a href={`https://www.wowhead.com/search?q=${encodeURIComponent(item)}`} target="_blank" rel="noreferrer" style={{ color:"var(--parch)", textDecoration:"none" }}>{item} ↗</a>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      <div className="bis-mode-bar">
        <button className={"bis-mode-btn" + (bisMode === "community" ? " active" : "")} onClick={() => switchBisMode("community")}>
          Community BiS
        </button>
        <div className="bis-mode-divider" />
        <button className={"bis-mode-btn" + (bisMode === "simc" ? " active" : "")} onClick={() => switchBisMode("simc")}>
          Character Scan
        </button>
        <div className="bis-mode-divider" />
        <button className={"bis-mode-btn" + (bisMode === "custom" ? " active" : "")} onClick={() => switchBisMode("custom")}>
          Custom Builder
        </button>
      </div>

      {bisMode === "community" && (
        <div className="bis-bar">
          <span className="bis-txt">✦ Suggestions sourced from community guides and current patch data</span>
          {spec.role === "Healer" && (
            <a href="https://questionablyepic.com" target="_blank" rel="noreferrer" className="bis-btn" style={{ marginRight:".4rem", background:"rgba(110,64,201,.15)", borderColor:"#6e40c9", color:"#c9a0ff", textDecoration:"none", display:"none" }}>✦ QE Live Rankings</a>
          )}
          <button className="bis-btn" onClick={loadSuggestions} disabled={loading}>
            {loading ? <>Loading...</> : sugs ? "↺ Refresh" : "✦ Load BiS Suggestions"}
          </button>
        </div>
      )}

      {bisMode === "simc" && (
        <div className="bis-bar no-print">
          <span className="bis-txt">✦ Paste your in-game SimC export to scan your equipped gear against your BiS list — checks off items you already have</span>
          <button className="bis-btn" onClick={() => setShowSimC(s => !s)} style={{ background:"rgba(201,146,42,.15)", borderColor:"var(--gold)", color:"var(--gold-lt)" }}>📋 {showSimC ? "Close" : "Open SimC Scanner"}</button>
        </div>
      )}

      {bisMode === "custom" && (
        <div className="bis-bar" style={{ flexDirection:"column", alignItems:"flex-start", gap:".3rem" }}>
          <span className="bis-txt" style={{ fontFamily:"Cinzel,serif", letterSpacing:".1em" }}>✦ Custom BiS Builder</span>
          <span style={{ fontSize:".8rem", color:"var(--parch-dk)", fontStyle:"italic" }}>
            Build your own ranked list — up to 3 options per slot. Use any source you trust. Tip: click <strong style={{color:"var(--gold-lt)"}}>Load BiS Suggestions → Apply All</strong> first to pre-fill the community list, then override individual slots with your own research. The export includes all slots — your custom choices plus the community fills.
          </span>
        </div>
      )}


      {bisMode === "simc" && showSimC && (
        <div className="no-print" style={{ background:"var(--panel)", border:"1px solid var(--bdr)", padding:"1rem", marginBottom:".75rem" }}>
          <div style={{ fontFamily:"Cinzel,serif", fontSize:".78rem", letterSpacing:".1em", color:"var(--gold)", marginBottom:".5rem" }}>SCAN YOUR CHARACTER</div>
          {!Object.values(data).some(d => d?.name) ? (
            <div style={{ background:"rgba(201,146,42,.08)", border:"1px solid var(--bdr2)", padding:".75rem", fontSize:".88rem", color:"var(--parch-dk)" }}>
              <div style={{ marginBottom:".5rem" }}>⚠ Load your BiS list first, then come back here to scan your character.</div>
              <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap" }}>
                <button className="tbtn sec" style={{ fontSize:".75rem", padding:".3rem .8rem" }} onClick={() => { setShowSimC(false); loadSuggestions(); }}>
                  1. Load BiS Suggestions
                </button>
                <span style={{ alignSelf:"center", opacity:.5, fontSize:".85rem" }}>→ then click Apply All → then return here</span>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize:".85rem", color:"var(--parch-dk)", marginBottom:".75rem", lineHeight:1.6 }}>
                Paste your SimC string below. Your character will be scanned and any BiS items you are currently wearing will be <strong style={{ color:"var(--gold-lt)" }}>automatically checked off</strong>.
              </div>
              <textarea
                value={simcStr}
                onChange={e => { setSimcStr(e.target.value); try { localStorage.setItem(`simc-${storageKey}`, e.target.value); } catch {} }}
                placeholder="Paste your SimC string here..."
                style={{ width:"100%", height:"100px", background:"var(--bg2)", border:"1px solid var(--bdr2)", color:"var(--parch)", fontFamily:"monospace", fontSize:".78rem", padding:".5rem", resize:"vertical", outline:"none" }}
              />
              <div style={{ display:"flex", gap:".5rem", marginTop:".5rem", flexWrap:"wrap", alignItems:"center" }}>
                <button className="tbtn pri" onClick={async () => {
                  if (!simcStr.trim()) { alert("Paste your SimC string first."); return; }
                  const worn = await parseSimC(simcStr);
                  if (!Object.keys(worn).length) { alert("No gear slots found. Make sure you copied the full SimC string from the SimulationCraft addon in-game (not a sim result). It should contain lines like: head=item_name,id=12345"); return; }
                  const vaultItems = parseSimCVaultItems(simcStr);
                  let matched = 0;
                  setData(prev => {
                    const next = { ...prev };
                    Object.entries(worn).forEach(([slot, wornName]) => {
                      if (next[slot]?.name && isBiSMatch(wornName, next[slot].name)) {
                        const detectedTrack = worn[slot + "_track"] || null;
                        next[slot] = { ...next[slot], done: true, ...(detectedTrack ? { track: detectedTrack } : {}) };
                        matched++;
                      }
                    });
                    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
                    return next;
                  });
                  const vaultHits = [];
                  setData(current => {
                    vaultItems.forEach(vi => {
                      Object.entries(current).forEach(([slot, slotData]) => {
                        if (slotData?.name && isBiSMatch(vi.name, slotData.name) && !slotData.done) {
                          vaultHits.push({ slot: SLOT_LABELS[slot] || slot, name: vi.name, ilvl: vi.ilvl, track: vi.track });
                        }
                      });
                    });
                    return current;
                  });
                  setVaultMatches(vaultHits);
                  setShowSimC(false);
                  setSimcStr("");
                  const vaultMsg = vaultHits.length > 0 ? `\n\n🎁 Great Vault: ${vaultHits.length} BiS item${vaultHits.length !== 1 ? "s" : ""} in your vault this week!` : "";
                  setTimeout(() => alert(`Scan complete! ${matched} BiS item${matched !== 1 ? "s" : ""} found on your character and checked off.${vaultMsg}`), 100);
                }}>⚔ Scan My Character</button>
                <button onClick={() => { setShowSimC(false); setSimcStr(""); }} style={{ fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".06em", padding:".35rem .8rem", background:"transparent", border:"1px solid var(--bdr2)", color:"var(--parch-dk)", cursor:"pointer" }}>Cancel</button>
              </div>
              <div style={{ fontSize:".73rem", color:"var(--parch-dk)", marginTop:".6rem", lineHeight:1.6 }}>
                <strong style={{ color:"var(--gold)", fontStyle:"normal" }}>In-game:</strong> SimulationCraft addon → Export → Copy to clipboard. The string should start with your class and character name.
                <span style={{ display:"block", marginTop:".4rem" }}>
                  <strong style={{ color:"var(--gold)", fontStyle:"normal" }}>Don't have SimC?</strong>{" "}
                  <strong style={{ color:"var(--gold)", fontStyle:"normal" }}>On mobile?</strong> Load your BiS list and check off items manually as you acquire them. SimC import is desktop only.{" "}<br/>Install SimC via{" "}
                  <a href="https://wowup.io/" target="_blank" rel="noreferrer" style={{ color:"var(--gold-lt)" }}>WowUp</a>
                  {" "}or{" "}
                  <a href="https://www.curseforge.com/wow/addons/simulationcraft" target="_blank" rel="noreferrer" style={{ color:"var(--gold-lt)" }}>CurseForge</a>.
                  Once installed, enable it in-game under Interface → AddOns, then type <code style={{ background:"var(--bg2)", padding:"0 .3rem", fontSize:".72rem" }}>/simc</code> to open the export window.
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {vaultMatches.length > 0 && (
        <div style={{ background:"rgba(201,146,42,.18)", border:"2px solid var(--gold)", padding:"1rem 1.25rem", marginBottom:"1rem", display:"flex", gap:"1rem", alignItems:"flex-start", flexWrap:"wrap", boxShadow:"0 0 20px rgba(201,146,42,.25)" }}>
          <div style={{ fontFamily:"Cinzel,serif", fontSize:".9rem", letterSpacing:".12em", color:"var(--gold)", flexShrink:0, textShadow:"0 0 10px rgba(201,146,42,.5)" }}>🎁 GREAT VAULT BiS</div>
          <div style={{ flex:1 }}>
            {vaultMatches.map((v, i) => (
              <div key={i} style={{ fontSize:".88rem", color:"var(--parch-dk)", marginBottom:".2rem" }}>
                <span style={{ color:"var(--parch-dk)", fontFamily:"Cinzel,serif", fontSize:".65rem", letterSpacing:".08em", textTransform:"uppercase" }}>{v.slot}</span>
                {" · "}
                <span style={{ color:"var(--parch)", fontSize:"1rem" }}>{v.name}</span>
                {v.track && <span style={{ color: TRACK_COLOR[v.track] || "var(--gold)", fontFamily:"Cinzel,serif", fontSize:".65rem", marginLeft:".5rem" }}>{v.track} {v.ilvl}</span>}
              </div>
            ))}
            <div style={{ fontSize:".75rem", color:"var(--parch-dk)", fontStyle:"italic", marginTop:".35rem", opacity:.7 }}>These BiS items are available in your Great Vault this week. Claim them before next reset.</div>
          </div>
          <button onClick={() => setVaultMatches([])} style={{ fontFamily:"Cinzel,serif", fontSize:".65rem", padding:".2rem .5rem", background:"transparent", border:"1px solid var(--bdr2)", color:"var(--parch-dk)", cursor:"pointer" }}>dismiss</button>
        </div>
      )}

      <div className="gear-grid">
        {LEFT_SLOTS.map((ls, i) => (
          <div key={ls.id} style={{ display:"contents" }}>
            <Slot label={ls.name} id={ls.id} data={data} onChange={upSlot} targetTrack={targetTrack} bisMode={bisMode} />
            {RIGHT_SLOTS[i] && <Slot label={RIGHT_SLOTS[i].name} id={RIGHT_SLOTS[i].id} data={data} onChange={upSlot} targetTrack={targetTrack} bisMode={bisMode} />}
          </div>
        ))}
      </div>

      <div className="sub-sh">Weapons</div>
      {cls.weaponNote && <div style={{ fontSize:".8rem", fontStyle:"italic", color:"var(--gold)", opacity:.8, marginBottom:".5rem" }}>⚠ {cls.weaponNote}</div>}
      {can2h && can1h && (
        <div className="sel-row" style={{ marginBottom:".65rem" }}>
          <button className={"selbtn" + (wMode === "2h" ? " on" : "")} onClick={() => setWMode("2h")}>⚔️ 2-Handed</button>
          <button className={"selbtn" + (wMode === "1h" ? " on" : "")} onClick={() => setWMode("1h")}>🗡️ One-Hander + Off Hand</button>
        </div>
      )}
      <div className="gear-grid">
        {(can2h && (!can1h || wMode === "2h")) && <Slot label="2H Weapon" id="weapon2h" data={data} onChange={upSlot} targetTrack={targetTrack} bisMode={bisMode} />}
        {(can1h && (!can2h || wMode === "1h")) && <Slot label="Main Hand" id="mainhand" data={data} onChange={upSlot} targetTrack={targetTrack} bisMode={bisMode} />}
        {(can1h && (!can2h || wMode === "1h")) && <Slot label="Off Hand" id="offhand" data={data} onChange={upSlot} targetTrack={targetTrack} bisMode={bisMode} />}
      </div>

      <div className="sub-sh">Trinkets</div>
      <div className="gear-grid">
        <Slot label="Trinket 1" id="trinket1" data={data} onChange={upSlot} targetTrack={targetTrack} bisMode={bisMode} />
        <Slot label="Trinket 2" id="trinket2" data={data} onChange={upSlot} targetTrack={targetTrack} bisMode={bisMode} />
      </div>

      {sugs && bisMode !== "custom" && (
        <div className="sug-panel fade" ref={sugRef}>
          <div className="sug-head">
            <span className="sug-title">BiS Suggestions{sugs.patch ? ` — ${sugs.patch}` : ""}</span>
            {!sugs.error && (
              <button className="tbtn pri" style={{ fontSize:".75rem", padding:".35rem .8rem" }} onClick={applyAll}>Apply All</button>
            )}
          </div>
          {sugs.error ? (
            <div style={{ padding:"1rem", fontStyle:"italic", opacity:.7, fontSize:".88rem" }}>
              Could not load suggestions. Check Wowhead or Icy Veins for current Midnight BiS.
            </div>
          ) : (
            <>
              <div className="sug-warn">⚠ Always verify on Wowhead or Icy Veins before progression content.</div>
              {sugs.crafting_note && (
                <div className="sug-craft">
                  <span className="sug-craft-lbl">⚒ Crafting Priority</span>
                  {sugs.crafting_note}
                </div>
              )}
              {Object.entries(sugs.slots).map(([k, v]) => (
                <div className="sug-item" key={k}>
                  <div className="sug-slot">{SLOT_LABELS[k] || k}</div>
                  <div className="sug-name">
                    <a href={`https://www.wowhead.com/search?q=${encodeURIComponent(v.name)}`} target="_blank" rel="noreferrer" style={{ color:"var(--parch)", textDecoration:"none" }}>
                      {v.name} ↗
                    </a>
                  </div>
                  <div className="sug-src">{v.source}</div>
                  <button className="apply-one" onClick={() => applyOne(k, v)}>Apply</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      <div className="tactions">
        <button className="tbtn dan" onClick={() => { if (window.confirm("Clear all entries?")) { setData({}); try { localStorage.removeItem(storageKey); } catch {} } }}>Clear All</button>
        <button className="tbtn sec" onClick={() => {
          const code = exportForAddon();
          if (!code) { alert("Load your BiS list first before exporting."); return; }
          window.__wowbisExportCode = code;
          const modal = document.createElement("div");
          modal.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;align-items:center;justify-content:center;";
          const inner = document.createElement("div");
          inner.style.cssText = "background:#150f08;border:1px solid #c9922a;padding:1.5rem;max-width:540px;width:90%;font-family:Cinzel,serif;";
          inner.innerHTML = `<div style="font-size:.75rem;letter-spacing:.15em;color:#c9922a;margin-bottom:.75rem">EXPORT FOR ADDON</div><div style="font-size:.85rem;color:#c8a96a;margin-bottom:.75rem;font-family:Crimson Pro,serif;line-height:1.6;">Copy this code and paste it into the WoW BiS Tracker addon in-game using the Import BiS button.</div>`;
          const ta = document.createElement("textarea");
          ta.readOnly = true;
          ta.value = code;
          ta.onclick = () => ta.select();
          ta.style.cssText = "width:100%;height:80px;background:#0a0704;border:1px solid #3d2c10;color:#c8a96a;font-family:monospace;font-size:.72rem;padding:.5rem;resize:none;outline:none;display:block;";
          inner.appendChild(ta);
          const btnRow = document.createElement("div");
          btnRow.style.cssText = "display:flex;gap:.5rem;margin-top:.75rem;justify-content:flex-end;";
          const copyBtn = document.createElement("button");
          copyBtn.textContent = "Copy";
          copyBtn.style.cssText = "font-family:Cinzel,serif;font-size:.72rem;letter-spacing:.06em;padding:.35rem .9rem;background:#c9922a;border:none;color:#1a0c00;cursor:pointer;font-weight:700;";
          copyBtn.onclick = () => {
            ta.select();
            try {
              navigator.clipboard.writeText(code).then(() => {
                copyBtn.textContent = "✓ Copied!";
                setTimeout(() => copyBtn.textContent = "Copy", 2000);
              }).catch(() => {
                document.execCommand("copy");
                copyBtn.textContent = "✓ Copied!";
                setTimeout(() => copyBtn.textContent = "Copy", 2000);
              });
            } catch {
              document.execCommand("copy");
              copyBtn.textContent = "✓ Copied!";
              setTimeout(() => copyBtn.textContent = "Copy", 2000);
            }
          };
          const closeBtn = document.createElement("button");
          closeBtn.textContent = "Close";
          closeBtn.style.cssText = "font-family:Cinzel,serif;font-size:.72rem;letter-spacing:.06em;padding:.35rem .9rem;background:transparent;border:1px solid #3d2c10;color:#c8a96a;cursor:pointer;";
          closeBtn.onclick = () => modal.remove();
          btnRow.appendChild(copyBtn);
          btnRow.appendChild(closeBtn);
          inner.appendChild(btnRow);
          modal.appendChild(inner);
          document.body.appendChild(modal);
          modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
          setTimeout(() => ta.select(), 100);
        }}>🎮 Export for Addon</button>
        <button className="tbtn sec" onClick={() => window.print()}>🖨 Print / PDF</button>
      </div>

    </div>
  );
}


function SpecPage({ cls, onBack, onGo }) {
  const [spec, setSpec] = useState(null);
  const [charName, setCharName] = useState("");
  const [savedChars, setSavedChars] = useState([]);

  useEffect(() => {
    if (!spec) return;
    try {
      const saved = JSON.parse(localStorage.getItem(`characters-${cls.id}-${spec.id}`) || "[]");
      setSavedChars(saved);
    } catch { setSavedChars([]); }
  }, [spec, cls.id]);

  const handleOpen = () => {
    if (!spec) return;
    const name = charName.trim() || "default";
    if (name && name !== "default") {
      try {
        const ckey = `characters-${cls.id}-${spec.id}`;
        const existing = JSON.parse(localStorage.getItem(ckey) || "[]");
        if (!existing.includes(name)) {
          localStorage.setItem(ckey, JSON.stringify([...existing, name]));
        }
      } catch {}
    }
    onGo(spec, name);
  };

  return (
    <div className="fade">
      <button className="back" onClick={onBack}>← All Classes</button>

      <div className="cbanner" style={{ borderColor: cls.color, background: `linear-gradient(135deg,var(--panel) 0%,${cls.color}12 100%)` }}>
        <div className="cbn" style={{ color: cls.color }}>{cls.name}</div>
        <div className="cbm">{cls.armor} Armor · {cls.specs.length} Specializations</div>
        {cls.weaponNote && <div className="cnote">⚠ {cls.weaponNote}</div>}
      </div>

      <div className="sh">Choose Specialization</div>
      <div className="spec-grid">
        {cls.specs.map(s => (
          <div key={s.id} className={"sc" + (spec?.id === s.id ? " sel" : "")} onClick={() => { setSpec(s); setCharName(""); }}>
            <span className="si">{s.icon}</span>
            <span className="sn">{s.name}</span>
            <span className="sr" style={{ background: `${ROLE_COLOR[s.role]}18`, border: `1px solid ${ROLE_COLOR[s.role]}`, color: ROLE_COLOR[s.role] }}>
              {ROLE_ICON[s.role]} {s.role}
            </span>
            {s.note && <span className="snote">{s.note}</span>}
          </div>
        ))}
      </div>

      {spec && (
        <div style={{ margin:"1.25rem 0 .75rem" }}>
          <div className="sh">
            Character Name
            <span style={{ fontFamily:"Crimson Pro,serif", fontStyle:"italic", fontWeight:300, textTransform:"none", letterSpacing:0, opacity:.6, fontSize:".8rem", marginLeft:".4rem" }}>
              (optional — name your character to track multiple of the same spec)
            </span>
          </div>
          <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", alignItems:"center" }}>
            <input
              value={charName}
              onChange={e => setCharName(e.target.value)}
              placeholder="e.g. Uldra, My Alt, Raider..."
              style={{ fontFamily:"Crimson Pro,serif", fontSize:"1rem", background:"var(--panel)", border:"1px solid var(--bdr2)", color:"var(--parch)", padding:".45rem .75rem", outline:"none", minWidth:"220px", flex:1, maxWidth:"320px" }}
            />
            {savedChars.length > 0 && savedChars.map(n => (
              <button key={n} className={"selbtn" + (charName === n ? " on" : "")} onClick={() => setCharName(n)} title={`Load ${n}`}>
                {n}
              </button>
            ))}
          </div>
          {savedChars.length > 0 && (
            <div style={{ fontSize:".75rem", color:"var(--parch-dk)", marginTop:".4rem", fontStyle:"italic", opacity:.7 }}>
              Saved characters shown above — click to load, or type a new name to create another tracker.
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: ".5rem", flexWrap: "wrap" }}>
        <button className="open-btn" disabled={!spec} onClick={handleOpen}>
          Open Tracker → {spec ? spec.name + (charName.trim() ? ` · ${charName.trim()}` : "") : "Select a spec above"}
        </button>
        {!spec && <span style={{ fontStyle: "italic", opacity: .45, fontSize: ".88rem" }}>Select a specialization to continue</span>}
      </div>
    </div>
  );
}

function useResetTimer(region) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const getNext = () => {
      const now = new Date();
      const next = new Date(now);
      if (region === "NA") {
        const day = now.getUTCDay();
        const daysUntilTue = (2 - day + 7) % 7 || 7;
        next.setUTCDate(now.getUTCDate() + daysUntilTue);
        next.setUTCHours(15, 0, 0, 0);
        if (next <= now) { next.setUTCDate(next.getUTCDate() + 7); }
      } else {
        const day = now.getUTCDay();
        const daysUntilWed = (3 - day + 7) % 7 || 7;
        next.setUTCDate(now.getUTCDate() + daysUntilWed);
        next.setUTCHours(7, 0, 0, 0);
        if (next <= now) { next.setUTCDate(next.getUTCDate() + 7); }
      }
      const diff = next - now;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      return `${d}d ${h}h ${m}m ${s}s`;
    };
    setTimeLeft(getNext());
    const t = setInterval(() => setTimeLeft(getNext()), 1000);
    return () => clearInterval(t);
  }, [region]);
  return timeLeft;
}

function getSavedCharacters() {
  const chars = [];
  const seen = new Set();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("bis-") || seen.has(key)) continue;
      seen.add(key);
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw);
      const slotCount = Object.keys(data).length;
      if (!slotCount) continue;
      const acquired = Object.values(data).filter(d => d?.done).length;
      const cls = CLASSES.reduce((best, c) => {
        if (!key.includes(c.id)) return best;
        return (!best || c.id.length > best.id.length) ? c : best;
      }, null);
      if (!cls) continue;
      const prefix = "bis-" + cls.id + "-";
      if (!key.startsWith(prefix)) continue;
      const rest = key.slice(prefix.length);
      const spec = cls.specs.reduce((best, s) => {
        if (!rest.startsWith(s.id)) return best;
        return (!best || s.id.length > best.id.length) ? s : best;
      }, null);
      if (!spec) continue;
      const charName = rest.slice(spec.id.length + 1) || "default";
      chars.push({ key, cls, spec, charName, slotCount, acquired });
    }
  } catch {}
  return chars.sort((a, b) => b.acquired - a.acquired);
}
function normalizeSrc(src) {
  if (!src) return "Unknown";
  const s = src.trim();
  if (s === "Tier Set" || s === "Raid | Catalyst | Vault" || s === "Catalyst|Raid|Vault" ||
      s === "Catalyst | Raid | Vault" || s.includes("Raid | Catalyst | Vault") ||
      s === "The Catalyst" || s === "Catalyst") return "Tier Set — Raid | Catalyst | Vault";
  if (s.includes("(Raid)")) return s.replace(" (Raid)", "").trim();
  return s;
}

function encodeFarmList(data) {
  try {
    const needed = {};
    Object.entries(data).forEach(([slot, d]) => {
      if (d?.name && !d?.done) {
        const src = normalizeSrc(d.src || "Unknown");
        if (!needed[src]) needed[src] = [];
        needed[src].push(d.name);
      }
    });
    if (!Object.keys(needed).length) return "";
    return btoa(unescape(encodeURIComponent(JSON.stringify(needed)))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
  } catch { return ""; }
}

function decodeFarmList(str) {
  try {
    const json = decodeURIComponent(escape(atob(str.trim().replace(/-/g,"+").replace(/_/g,"/"))));
    return JSON.parse(json);
  } catch { return null; }
}

function GroupPlanner() {
  const [members, setMembers] = useState([{ code:"", name:"" }]);
  const [result, setResult] = useState(null);
  const [priorityMode, setPriorityMode] = useState("overlap");
  const [focusPlayer, setFocusPlayer] = useState("");
  const [copied, setCopied] = useState(false);

  const addMember = () => { if (members.length < 5) setMembers(m => [...m, { code:"", name:"" }]); };
  const removeMember = i => setMembers(m => m.filter((_, j) => j !== i));
  const upMember = (i, f, v) => setMembers(m => m.map((x, j) => j === i ? { ...x, [f]: v } : x));

  const analyze = () => {
    const parsed = members
      .map((m, i) => ({ name: m.name.trim() || `Player ${i+1}`, data: decodeFarmList(m.code) }))
      .filter(m => m.data && Object.keys(m.data).length > 0);
    if (!parsed.length) { alert("No valid farm codes found. Make sure each player has pasted their code correctly."); return; }
    const allSources = {};
    parsed.forEach(({ name, data }) => {
      Object.entries(data).forEach(([src, items]) => {
        const normalized = normalizeSrc(src);
        if (!allSources[normalized]) allSources[normalized] = {};
        if (!allSources[normalized][name]) allSources[normalized][name] = [];
        allSources[normalized][name].push(...items);
      });
    });
    let sorted = Object.entries(allSources)
      .map(([src, playerMap]) => ({
        src,
        playerCount: Object.keys(playerMap).length,
        totalItems: Object.values(playerMap).flat().length,
        playerMap,
        shared: Object.keys(playerMap).length > 1,
      }));
    if (priorityMode === "focus" && focusPlayer) {
      sorted.sort((a, b) => {
        const aHas = focusPlayer in a.playerMap ? 1 : 0;
        const bHas = focusPlayer in b.playerMap ? 1 : 0;
        if (bHas !== aHas) return bHas - aHas;
        return b.playerCount - a.playerCount || b.totalItems - a.totalItems;
      });
    } else {
      sorted.sort((a, b) => b.playerCount - a.playerCount || b.totalItems - a.totalItems);
    }
    const shared = sorted.filter(s => s.shared);
    const solo = sorted.filter(s => !s.shared);
    setResult({ players: parsed.map(p => p.name), shared, solo });
  };

  const allSaved = getSavedCharacters();
  const [selectedChar, setSelectedChar] = useState(0);
  const selectedSaved = allSaved[selectedChar];
  const myCode = selectedSaved ? encodeFarmList(JSON.parse(localStorage.getItem(selectedSaved.key) || "{}")) : "";

  const copyCode = () => {
    navigator.clipboard?.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tag = (count, total) => {
    if (count >= 3) return { bg:"var(--crimson)", label:`${count} players · RUN THIS TOGETHER` };
    if (count === 2) return { bg:"rgba(201,146,42,.6)", label:`${count} players · worth grouping` };
    return { bg:"var(--bdr2)", label:"solo only" };
  };

  return (
    <div style={{ background:"var(--panel)", border:"1px solid var(--bdr)", padding:"1rem 1.25rem", marginBottom:".5rem" }}>
      <div style={{ fontSize:".85rem", color:"var(--parch-dk)", marginBottom:"1rem", lineHeight:1.65 }}>
        Each player exports their farm code from their tracker and pastes it here. The planner finds which dungeons and raids your group should run together to maximize everyone's gear progress.
      </div>

      {allSaved.length > 0 && (
        <div style={{ background:"rgba(201,146,42,.07)", border:"1px solid var(--bdr2)", padding:".75rem .9rem", marginBottom:"1rem" }}>
          <div style={{ fontFamily:"Cinzel,serif", fontSize:".65rem", letterSpacing:".1em", color:"var(--gold)", marginBottom:".5rem" }}>STEP 1 — COPY YOUR FARM CODE</div>
          {(() => {
            const cg = {};
            allSaved.forEach((c, i) => {
              const gk = `${c.charName}||${c.cls.id}`;
              if (!cg[gk]) cg[gk] = { charName: c.charName, cls: c.cls, specs: [] };
              cg[gk].specs.push({ ...c, idx: i });
            });
            return Object.values(cg).map(({ charName, cls, specs }) => {
              const dn = charName === "default" ? cls.name : charName;
              return (
                <div key={`${charName}-${cls.id}`} style={{ display:"flex", alignItems:"center", gap:".4rem", flexWrap:"wrap", marginBottom:".4rem" }}>
                  <span style={{ fontFamily:"Cinzel,serif", fontSize:".75rem", color:cls.color, minWidth:"90px" }}>{dn}</span>
                  <span style={{ fontSize:".7rem", color:"var(--parch-dk)", opacity:.6 }}>{cls.name}</span>
                  <div style={{ display:"flex", gap:".25rem", flexWrap:"wrap", marginLeft:".25rem" }}>
                    {specs.map(s => (
                      <button key={s.key} onClick={() => setSelectedChar(s.idx)}
                        style={{ fontFamily:"Cinzel,serif", fontSize:".68rem", letterSpacing:".04em", padding:".18rem .55rem", background: selectedChar === s.idx ? cls.color : "transparent", border:`1px solid ${cls.color}`, color: selectedChar === s.idx ? "#fff" : cls.color, cursor:"pointer", transition:"all .12s" }}>
                        {s.spec.icon} {s.spec.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
          {myCode ? (
            <>
              <div style={{ display:"flex", gap:".5rem", alignItems:"center", marginBottom:".35rem" }}>
                <span style={{ fontSize:".75rem", color:"var(--parch-dk)" }}>Your farm code — share this with your group:</span>
                <button onClick={copyCode} style={{ fontFamily:"Cinzel,serif", fontSize:".68rem", letterSpacing:".06em", padding:".25rem .75rem", background:"var(--gold)", border:"none", color:"var(--ink)", cursor:"pointer", flexShrink:0, fontWeight:700, minWidth:"80px", marginLeft:"auto" }}>{copied ? "✓ Copied!" : "Copy Code"}</button>
              </div>
              <textarea
                readOnly
                value={myCode}
                onFocus={e => e.target.select()}
                style={{ width:"100%", fontFamily:"monospace", fontSize:".72rem", background:"var(--bg2)", border:"1px solid var(--bdr)", color:"var(--parch-dk)", padding:".4rem .5rem", resize:"none", outline:"none", height:"52px", cursor:"text" }}
              />
              <div style={{ fontSize:".7rem", color:"var(--parch-dk)", marginTop:".25rem", fontStyle:"italic", opacity:.7 }}>Click the code to select all, then copy manually or use the button above. Share this code with your group members so they can paste it in Step 2.</div>
            </>
          ) : (
            <div style={{ fontSize:".8rem", color:"var(--parch-dk)", fontStyle:"italic" }}>Open your tracker → Load BiS Suggestions → click Apply All → then come back here for your farm code.</div>
          )}
        </div>
      )}

      <div style={{ fontFamily:"Cinzel,serif", fontSize:".65rem", letterSpacing:".1em", color:"var(--gold)", marginBottom:".5rem" }}>STEP 2 — ADD PLAYERS (paste everyone's codes including yourself as Player 1)</div>
      <div style={{ display:"flex", flexDirection:"column", gap:".4rem", marginBottom:".65rem" }}>
        {members.map((m, i) => (
          <div key={i} style={{ display:"flex", gap:".4rem", alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontFamily:"Cinzel,serif", fontSize:".65rem", color:"var(--gold)", width:"16px", textAlign:"center", flexShrink:0 }}>{i+1}</span>
            <input value={m.name} onChange={e => upMember(i, "name", e.target.value)} placeholder={i === 0 ? "Your name" : `Player ${i+1} name`} style={{ fontFamily:"Crimson Pro,serif", fontSize:".88rem", background:"var(--bg2)", border:"1px solid var(--bdr2)", color:"var(--parch)", padding:".32rem .55rem", outline:"none", width:"120px" }} />
            <input value={m.code} onChange={e => upMember(i, "code", e.target.value)} placeholder="Paste farm code here..." style={{ fontFamily:"monospace", fontSize:".72rem", background:"var(--bg2)", border:"1px solid var(--bdr2)", color:"var(--parch)", padding:".32rem .55rem", outline:"none", flex:1, minWidth:"160px" }} />
            {members.length > 1 && <button onClick={() => removeMember(i)} style={{ background:"transparent", border:"none", color:"var(--parch-dk)", cursor:"pointer", fontSize:"1rem", flexShrink:0, opacity:.6, lineHeight:1 }}>×</button>}
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", alignItems:"center", marginBottom:".65rem" }}>
        {members.length < 5 && <button className="selbtn" onClick={addMember}>+ Add Player</button>}
        <div style={{ display:"flex", gap:".35rem", marginLeft:"auto", alignItems:"center" }}>
          <span style={{ fontSize:".72rem", color:"var(--parch-dk)" }}>Priority:</span>
          <button className={"selbtn" + (priorityMode === "overlap" ? " on" : "")} onClick={() => setPriorityMode("overlap")}>Most overlap</button>
          <button className={"selbtn" + (priorityMode === "focus" ? " on" : "")} onClick={() => setPriorityMode("focus")}>Gear up player</button>
        </div>
      </div>
      {priorityMode === "focus" && (
        <div style={{ display:"flex", gap:".5rem", alignItems:"center", marginBottom:".65rem", flexWrap:"wrap" }}>
          <span style={{ fontSize:".75rem", color:"var(--parch-dk)" }}>Prioritize:</span>
          {members.filter(m => m.name.trim()).map((m, i) => (
            <button key={i} className={"selbtn" + (focusPlayer === m.name.trim() ? " on" : "")} onClick={() => setFocusPlayer(m.name.trim())}>{m.name.trim()}</button>
          ))}
          <span style={{ fontSize:".72rem", color:"var(--parch-dk)", fontStyle:"italic" }}>Content that helps this player comes first</span>
        </div>
      )}

      <button className="tbtn pri" style={{ fontSize:".78rem", padding:".4rem 1.1rem" }} onClick={analyze}>⚔ Analyze Group</button>
      {result && <button className="selbtn" style={{ marginLeft:".5rem" }} onClick={() => setResult(null)}>Clear</button>}

      {result && (
        <div style={{ marginTop:"1.25rem" }}>
          {result.shared.length > 0 ? (
            <>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:".7rem", letterSpacing:".12em", color:"var(--gold-lt)", marginBottom:".6rem", borderBottom:"1px solid var(--bdr)", paddingBottom:".4rem" }}>
                ⚔ RUN THESE TOGETHER — {result.shared.length} shared location{result.shared.length > 1 ? "s" : ""}
              </div>
              {result.shared.map(({ src, playerCount, playerMap }) => {
                const t = tag(playerCount, 0);
                return (
                  <div key={src} style={{ marginBottom:".75rem", padding:".6rem .75rem", border:"1px solid var(--bdr2)", background:"rgba(201,146,42,.04)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".4rem", flexWrap:"wrap" }}>
                      <span style={{ color:"var(--gold-lt)", fontFamily:"Cinzel,serif", fontSize:".85rem" }}>{src}</span>
                      <span style={{ background:t.bg, color:"#fff", fontSize:".62rem", fontFamily:"Cinzel,serif", padding:".06rem .45rem", letterSpacing:".04em" }}>{t.label}</span>
                    </div>
                    {Object.entries(playerMap).map(([player, items]) => (
                      <div key={player} style={{ fontSize:".82rem", paddingLeft:".5rem", marginBottom:".15rem", display:"flex", gap:".4rem", flexWrap:"wrap" }}>
                        <span style={{ color:"var(--gold)", fontFamily:"Cinzel,serif", fontSize:".7rem", flexShrink:0 }}>{player}:</span>
                        <span style={{ color:"var(--parch-dk)" }}>{items.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ) : (
            <div style={{ background:"rgba(110,64,201,.08)", border:"1px solid rgba(110,64,201,.3)", padding:".75rem", fontSize:".85rem", color:"var(--parch-dk)", marginBottom:"1rem" }}>
              No shared content found — your group doesn't need items from the same locations. Run separately or use Gear Up Player mode to prioritize one member.
            </div>
          )}

          {result.solo.length > 0 && (
            <>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:".7rem", letterSpacing:".12em", color:"var(--parch-dk)", marginBottom:".5rem", marginTop:".75rem", opacity:.7 }}>INDIVIDUAL RUNS (only one player needs items here)</div>
              {result.solo.map(({ src, playerMap }) => (
                <div key={src} style={{ marginBottom:".4rem", display:"flex", gap:".5rem", flexWrap:"wrap", fontSize:".82rem" }}>
                  <span style={{ color:"var(--parch-dk)", fontFamily:"Cinzel,serif", fontSize:".72rem", minWidth:"140px" }}>{src}</span>
                  {Object.entries(playerMap).map(([player, items]) => (
                    <span key={player} style={{ color:"var(--parch-dk)" }}><span style={{ color:"var(--parch)" }}>{player}</span>: {items.slice(0,2).join(", ")}{items.length > 2 ? ` +${items.length-2} more` : ""}</span>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}


function AddonImportBox({ onCharsLoaded }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  const [isErr, setIsErr] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const TRACK_CODES = { v:"Veteran", c:"Champion", h:"Hero", m:"Myth" };
  // Unambiguous mapping: class display name → { addonSpecName → websiteSpecId }
  // websiteSpecId must exactly match the spec id in the CLASSES array
  const CLASS_SPEC_MAP = {
    "Druid":        { "Balance":"balance","Feral":"feral","Guardian":"guardian","Restoration":"restoration-druid" },
    "Hunter":       { "Beast Mastery":"beast-mastery","Marksmanship":"marksmanship","Survival":"survival" },
    "Mage":         { "Arcane":"arcane","Fire":"fire","Frost Mage":"frost-mage" },
    "Monk":         { "Brewmaster":"brewmaster","Mistweaver":"mistweaver","Windwalker":"windwalker" },
    "Paladin":      { "Holy":"holy-pala","Protection":"protection-pala","Retribution":"retribution" },
    "Priest":       { "Discipline":"discipline","Holy Priest":"holy-priest","Shadow":"shadow" },
    "Rogue":        { "Assassination":"assassination","Outlaw":"outlaw","Subtlety":"subtlety" },
    "Shaman":       { "Elemental":"elemental","Enhancement":"enhancement","Restoration Shaman":"restoration-sham" },
    "Warlock":      { "Affliction":"affliction","Demonology":"demonology","Destruction":"destruction" },
    "Warrior":      { "Arms":"arms","Fury":"fury","Protection":"protection-war" },
    "Death Knight": { "Blood":"blood","Frost":"frost-dk","Unholy":"unholy" },
    "Demon Hunter": { "Havoc":"havoc","Vengeance":"vengeance","Devourer":"devourer" },
    "Evoker":       { "Devastation":"devastation","Preservation":"preservation","Augmentation":"augmentation" },
  };
  const CLASS_ID_MAP = {
    "Druid":"druid","Hunter":"hunter","Mage":"mage","Monk":"monk",
    "Paladin":"paladin","Priest":"priest","Rogue":"rogue","Shaman":"shaman",
    "Warlock":"warlock","Warrior":"warrior","Death Knight":"death-knight",
    "Demon Hunter":"demon-hunter","Evoker":"evoker",
  };

  const parseSlots = (slotStr) => {
    const data = {};
    slotStr.split("|").filter(Boolean).forEach(entry => {
      const parts = entry.split(":");
      if (parts.length < 4) return;
      const [sid, name, src, acq, trCode] = parts;
      const SLOT_TO_KEY = {"1":"head","2":"neck","3":"shoulders","5":"chest","6":"waist","7":"legs","8":"feet","9":"wrist","10":"hands","11":"finger1","12":"finger2","13":"trinket1","14":"trinket2","15":"back","16":"mainhand","17":"offhand"};
      const key = SLOT_TO_KEY[sid];
      if (!key || !name) return;
      data[key] = {
        name: name.trim(),
        src:  src.trim(),
        done: acq === "1",
        ...(trCode && TRACK_CODES[trCode] ? { track: TRACK_CODES[trCode] } : {})
      };
    });
    return data;
  };

  const doImport = () => {
    const raw = code.trim();
    if (!raw) { setIsErr(true); setMsg("Paste your export code from the addon first."); return; }

    const sections = raw.split("###").filter(Boolean);
    if (!sections.length) { setIsErr(true); setMsg("Could not read code."); return; }

    // Extract CHAR header — new format includes class name
    const charSection2 = sections.find(s => s.startsWith("CHAR~"));
    if (!charSection2) {
      setIsErr(true);
      setMsg("Could not read character info. Update the addon to the latest version and try again.");
      return;
    }
    const hParts = charSection2.split("~");
    const charName2  = (hParts[1] || "").trim() || "default";
    const realm2     = (hParts[2] || "").trim();
    const className  = (hParts[3] || "").trim();
    const charLabel  = realm2 ? `${charName2}-${realm2}` : charName2;

    if (!className || !CLASS_SPEC_MAP[className]) {
      setIsErr(true);
      setMsg(`Class "${className || "unknown"}" not recognised. Update the addon and try again.`);
      return;
    }

    const specSections = sections.filter(s => s.startsWith("SPEC~"));
    if (!specSections.length) {
      setIsErr(true);
      setMsg("No spec data found. Use the Export button inside the WoW BiS Tracker addon.");
      return;
    }

    const clsId = CLASS_ID_MAP[className];
    let imported = 0;
    const loadedSpecs = [];

    specSections.forEach(section => {
      const sParts = section.split("~");
      if (sParts[0] !== "SPEC" || !sParts[1] || !sParts[2]) return;
      const specName = sParts[1].trim();
      const slotStr  = sParts[2];
      const data     = parseSlots(slotStr);
      if (!Object.keys(data).length) return;
      const specId = CLASS_SPEC_MAP[className][specName];
      if (!specId) return;
      const storageKey = `bis-${clsId}-${specId}-${charLabel}`;
      let existing = {};
      try { existing = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch {}
      const merged = { ...existing };
      Object.entries(data).forEach(([slot, val]) => {
        merged[slot] = { ...(existing[slot] || {}), ...val };
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(merged));
        const ck = `characters-${clsId}-${specId}`;
        const chars = JSON.parse(localStorage.getItem(ck) || "[]");
        if (!chars.includes(charLabel)) {
          localStorage.setItem(ck, JSON.stringify([...chars, charLabel]));
        }
      } catch {}
      imported++;
      loadedSpecs.push(specName);
    });

    if (imported === 0) {
      setIsErr(true);
      setMsg("Could not match any specs. Make sure you used the Export button inside the addon.");
      return;
    }
    // Clean up stale entries from wrong-class imports (old format bug)
    // Remove any bis-WRONGCLS-spec-charLabel keys that don't belong to this class
    const validKeys = new Set(
      Object.values(CLASS_SPEC_MAP[className]).map(specId => `bis-${clsId}-${specId}-${charLabel}`)
    );
    try {
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) allKeys.push(localStorage.key(i));
      allKeys.forEach(k => {
        if (!k || !k.startsWith("bis-") || !k.endsWith(`-${charLabel}`)) return;
        if (!validKeys.has(k) && k !== `bis-${clsId}-`) {
          // This key belongs to a different class — remove it if it was created for this charLabel
          const parts = k.split("-");
          if (parts.length >= 4) localStorage.removeItem(k);
        }
      });
    } catch {}
    setIsErr(false);
    setLoaded(true);
    const who = realm2 ? `${charName2} — ${realm2}` : charName2;
    setMsg(`Synced ${imported} spec(s) for ${who} (${className}): ${[...new Set(loadedSpecs)].join(", ")}. Your characters now appear below.`);
    if (onCharsLoaded) onCharsLoaded();
  };

  return (
    <div style={{ background:"var(--panel)", border:"1px solid rgba(201,146,42,.4)", padding:"1.25rem", marginBottom:"1.5rem" }}>
      <div style={{ fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".12em", color:"var(--gold)", marginBottom:".4rem" }}>SYNC FROM IN-GAME ADDON</div>
      <div style={{ fontSize:".85rem", color:"var(--parch-dk)", marginBottom:".85rem", lineHeight:1.65 }}>
        In the addon, open the <strong style={{ color:"var(--parch)" }}>Farm Priority</strong> tab and click <strong style={{ color:"var(--parch)" }}>Export</strong>. This exports all your specs at once. Paste the code below — your characters will appear automatically, no manual setup needed.
      </div>
      <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap" }}>
        <input value={code} onChange={e => { setCode(e.target.value); setMsg(null); setLoaded(false); }}
          placeholder="Paste your addon export code here..."
          style={{ flex:1, minWidth:"220px", background:"var(--bg2)", border:`1px solid ${isErr ? "#ff6d6d" : "var(--bdr2)"}`, color:"var(--parch)", fontFamily:"monospace", fontSize:".76rem", padding:".45rem .65rem", outline:"none" }} />
        <button onClick={doImport} style={{ fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".06em", padding:".45rem 1rem", background:"var(--gold)", border:"none", color:"var(--ink)", cursor:"pointer", fontWeight:700, flexShrink:0 }}>
          Sync to Website
        </button>
      </div>
      {msg && (
        <div style={{ fontSize:".82rem", color: isErr ? "#ff6d6d" : loaded ? "#66bb6a" : "var(--parch-dk)", marginTop:".6rem", lineHeight:1.6 }}>
          {msg}
        </div>
      )}
    </div>
  );
}

function Home({ onSelectClass, onLoadCharacter }) {
  const [roleFilter, setRoleFilter] = useState("All");
  const [resetRegion, setResetRegion] = useState("NA");
  const [savedChars, setSavedChars] = useState(() => getSavedCharacters());
  const roles = ["All", "Tank", "Healer", "DPS"];
  const filtered = CLASSES.filter(c => roleFilter === "All" || c.roles.includes(roleFilter));
  const timeLeft = useResetTimer(resetRegion);
  const handleDelete = () => setSavedChars(getSavedCharacters());

  useEffect(() => {
    if (window.location.hash === "#group-planner") {
      setTimeout(() => {
        const el = document.getElementById("group-planner");
        if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
      }, 300);
    }
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior:"smooth", block:"start" });
      el.style.outline = "2px solid var(--gold)";
      setTimeout(() => { el.style.outline = ""; }, 1400);
    }
  };

  return (
    <div className="fade">
      <div className="home-layout">
        <div className="home-main">

      <div id="select-class" className="sh">Filter by Role</div>
      <div className="role-strip">
        {roles.map(r => (
          <button key={r} className="rpill" onClick={() => setRoleFilter(r)} style={{
            borderColor: r === "All" ? "var(--gold)" : ROLE_COLOR[r],
            color:       roleFilter === r ? "var(--ink)" : r === "All" ? "var(--gold-lt)" : ROLE_COLOR[r],
            background:  roleFilter === r ? r === "All" ? "var(--gold)" : ROLE_COLOR[r] : "transparent",
          }}>
            {r !== "All" && ROLE_ICON[r]} {r}
          </button>
        ))}
      </div>

      <AddonImportBox onCharsLoaded={() => setSavedChars(getSavedCharacters())} />
      <div className="sh">Select Your Class</div>
      <div className="class-grid">
        {filtered.map(cls => (
          <div key={cls.id} className="cc" style={{ "--cc-color": cls.color }} onClick={() => onSelectClass(cls)}>
            <div className="cc-name" style={{ color: cls.color }}>{cls.name}</div>
            <div className="cc-specs">{cls.specs.length} specs</div>
            <div className="cc-dots">
              {[...new Set(cls.specs.map(s => s.role))].map(r => (
                <div key={r} className="rdot" style={{ background: ROLE_COLOR[r] }} title={r} />
              ))}
            </div>
          </div>
        ))}
      </div>


        </div>{/* home-main */}

        <aside className="weekly-sidebar">
          <div style={{ background:"var(--panel)", border:"1px solid var(--bdr2)", padding:"1.25rem", borderRadius:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:".75rem", flexWrap:"wrap" }}>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".14em", color:"var(--gold)" }}>WEEKLY RESET</div>
              <div className="exp-badge" style={{ margin:0, padding:".15rem .6rem", fontSize:".6rem" }}>Midnight · S1</div>
              <div style={{ display:"flex", gap:".3rem", marginLeft:"auto" }}>
                {["NA","EU"].map(r => (
                  <button key={r} onClick={() => setResetRegion(r)} style={{ fontFamily:"Cinzel,serif", fontSize:".65rem", letterSpacing:".08em", padding:".18rem .55rem", background: resetRegion === r ? "var(--gold)" : "transparent", border:"1px solid " + (resetRegion === r ? "var(--gold)" : "var(--bdr2)"), color: resetRegion === r ? "var(--ink)" : "var(--parch-dk)", cursor:"pointer" }}>{r}</button>
                ))}
              </div>
            </div>
            <div style={{ fontSize:"2rem", fontFamily:"Cinzel,serif", color:"var(--gold-lt)", letterSpacing:".04em", lineHeight:1, marginBottom:".75rem" }}>{timeLeft}</div>

            <div style={{ fontSize:".78rem", color:"var(--parch-dk)", fontStyle:"italic", lineHeight:1.5, marginBottom:"1rem" }}>
              {resetRegion === "NA" ? "Tuesday · 8am Pacific" : "Wednesday · 8am CET"}
            </div>
            <div style={{ borderTop:"1px solid var(--bdr)", paddingTop:".85rem" }}>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:".65rem", letterSpacing:".1em", color:"var(--gold)", marginBottom:".5rem" }}>GREAT VAULT</div>
              <div style={{ fontSize:".92rem", color:"var(--parch-dk)", lineHeight:1.6 }}>
                Open your Great Vault in-game after each reset. The <strong style={{ color:"var(--gold-lt)" }}>WoW BiS Tracker addon</strong> will automatically highlight any vault options that match your BiS list — including gear track.
              </div>
            </div>
          </div>
        </aside>

      </div>{/* home-layout */}

      <div style={{ height:"2rem" }} />
      {savedChars.length > 0 && (() => {
        const groups = {};
        savedChars.forEach(entry => {
          const groupKey = `${entry.charName}||${entry.cls.id}`;
          if (!groups[groupKey]) groups[groupKey] = { charName: entry.charName, cls: entry.cls, specs: [] };
          groups[groupKey].specs.push(entry);
        });
        return (
          <div style={{ marginBottom:"1.5rem" }}>
            <div className="sh">Your Characters</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:".75rem" }}>
              {Object.values(groups).map(({ charName, cls, specs }) => {
                const totalAcq = specs.reduce((s,e) => s + e.acquired, 0);
                const totalSlots = specs.reduce((s,e) => s + e.slotCount, 0);
                const pct = totalSlots ? Math.round(totalAcq / totalSlots * 100) : 0;
                const displayName = charName === "default" ? cls.name : charName;
                return (
                  <div key={`${charName}-${cls.id}`}
                    style={{ background:"var(--panel)", border:`1px solid ${cls.color}44`, padding:".85rem 1rem", position:"relative" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = cls.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = cls.color + "44"}>
                    <button onClick={e => {
                      e.stopPropagation();
                      if (!window.confirm(`Remove all data for ${displayName} (${cls.name})?`)) return;
                      specs.forEach(({ key, spec }) => {
                        localStorage.removeItem(key);
                        try {
                          const ck = `characters-${cls.id}-${spec.id}`;
                          const existing = JSON.parse(localStorage.getItem(ck) || "[]");
                          localStorage.setItem(ck, JSON.stringify(existing.filter(n => n !== charName)));
                        } catch {}
                      });
                      handleDelete();
                    }} style={{ position:"absolute", top:".4rem", right:".5rem", background:"transparent", border:"none", color:"var(--parch-dk)", cursor:"pointer", fontSize:"1.1rem", lineHeight:1, padding:".15rem .3rem", zIndex:2 }} title="Remove character">×</button>
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:cls.color }} />
                    <div style={{ fontFamily:"Cinzel,serif", fontSize:".88rem", color:cls.color, fontWeight:600, marginBottom:".2rem", paddingRight:"1.5rem" }}>{displayName}</div>
                    <div style={{ fontSize:".72rem", color:"var(--parch-dk)", marginBottom:".5rem" }}>{cls.name}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:".3rem", marginBottom:".6rem" }}>
                      {specs.map(({ spec, charName: cn, acquired, slotCount }) => {
                        const spct = slotCount ? Math.round(acquired / slotCount * 100) : 0;
                        return (
                          <button key={spec.id} onClick={() => onLoadCharacter(cls, spec, cn)}
                            style={{ display:"flex", alignItems:"center", gap:".3rem", background:"var(--bg2)", border:`1px solid ${cls.color}55`, padding:".2rem .5rem", cursor:"pointer", fontSize:".75rem", color:"var(--parch-dk)", fontFamily:"Cinzel,serif" }}
                            title={`${spec.name} — ${acquired}/${slotCount} acquired`}>
                            <span>{spec.icon}</span>
                            <span style={{ color:cls.color }}>{spec.name}</span>
                            <span style={{ opacity:.7 }}>{spct}%</span>
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ background:"var(--bdr)", height:"3px", position:"relative" }}>
                      <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:cls.color, transition:"width .4s" }} />
                    </div>
                    <div style={{ fontSize:".7rem", color:"var(--parch-dk)", marginTop:".3rem" }}>{totalAcq}/{totalSlots} total · {pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
      <div className="sh" id="group-planner">Group Farm Planner</div>
      <GroupPlanner />

      <div style={{ marginTop:"2.5rem" }} />
      <div id="vs-addon" className="sh">Website vs In-Game Addon</div>
      <p style={{ fontSize:".9rem", color:"var(--parch-dk)", marginBottom:"1.5rem", lineHeight:1.7 }}>
        Both tools are free. Use either independently, or together — export from the addon to sync your progress to the website.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem", marginBottom:"1rem" }}>

        {/* Website column */}
        <div style={{ background:"var(--panel)", border:"1px solid var(--bdr2)", display:"flex", flexDirection:"column" }}>
          <div style={{ background:"rgba(201,146,42,.08)", borderBottom:"1px solid var(--bdr2)", padding:"1rem 1.25rem" }}>
            <div style={{ fontFamily:"Cinzel,serif", fontSize:".78rem", letterSpacing:".14em", color:"var(--gold)", marginBottom:".3rem" }}>THIS WEBSITE</div>
            <div style={{ fontSize:".85rem", color:"var(--parch-dk)", lineHeight:1.6 }}>Plan and track your gear from any browser. No download required.</div>
          </div>
          <div style={{ padding:"1.25rem", flex:1 }}>
            {[
              { title:"All characters at a glance", desc:"Every character and spec tracked in one place without switching between them." },
              { title:"SimC import", desc:"Paste a SimC string to instantly fill in every item you're wearing and its gear track." },
              { title:"Export to addon", desc:"Generate a code to push your website progress into the in-game addon." },
              { title:"Group planning links", desc:"Share a URL on Discord so your party can coordinate farm runs — no addon needed on their end." },
              { title:"Print farm lists", desc:"Clean printable farm priority list for the week. Works as PDF too." },
              { title:"Visual progress", desc:"Progress bars across all specs and characters. Good for seeing where you are at a glance." },
            ].map(({ title, desc }) => (
              <div key={title} style={{ paddingBottom:"1rem", marginBottom:"1rem", borderBottom:"1px solid var(--bdr)" }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".06em", color:"var(--parch)", marginBottom:".35rem" }}>{title}</div>
                <div style={{ fontSize:".82rem", color:"var(--parch-dk)", lineHeight:1.65 }}>{desc}</div>
              </div>
            ))}
            <div style={{ background:"rgba(0,0,0,.2)", border:"1px solid var(--bdr2)", padding:"1rem", marginTop:".25rem" }}>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:".68rem", letterSpacing:".1em", color:"var(--gold)", marginBottom:".75rem" }}>HOW TO USE THIS SITE</div>
              {[
                "Select your class and spec below",
                "Click Load BiS Suggestions → Apply All",
                "Mark acquired items using the checkboxes",
                "Set each item's gear track with the track pills",
                "Check Farm Priority to see what to run this week",
                "Use SimC Import to auto-fill from your character data",
              ].map((s, i) => (
                <div key={s} style={{ display:"flex", gap:".6rem", marginBottom:".5rem", fontSize:".82rem", color:"var(--parch-dk)" }}>
                  <span style={{ color:"var(--gold)", fontFamily:"Cinzel,serif", fontSize:".7rem", flexShrink:0, marginTop:".1rem" }}>{i+1}.</span>
                  <span style={{ lineHeight:1.6 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Addon column */}
        <div style={{ background:"var(--panel)", border:"1px solid var(--bdr2)", display:"flex", flexDirection:"column" }}>
          <div style={{ background:"rgba(201,146,42,.08)", borderBottom:"1px solid var(--bdr2)", padding:"1rem 1.25rem" }}>
            <div style={{ fontFamily:"Cinzel,serif", fontSize:".78rem", letterSpacing:".14em", color:"var(--gold)", marginBottom:".3rem" }}>IN-GAME ADDON</div>
            <div style={{ fontSize:".85rem", color:"var(--parch-dk)", lineHeight:1.6 }}>Works standalone inside WoW. BiS list loads automatically — no setup, no website needed.</div>
          </div>
          <div style={{ padding:"1.25rem", flex:1 }}>
            {[
              { title:"Auto-loads for your spec", desc:"Detects your class and spec on login. Switch specs mid-session and it switches instantly." },
              { title:"Scan Gear", desc:"Reads your equipped items and auto-detects their gear track directly from the in-game tooltip. No guessing." },
              { title:"Farm Priority", desc:"Shows exactly which dungeons and raids to run this week, sorted by how many items you need there." },
              { title:"All My Specs farm view", desc:"One click shows every location that has BiS items across all your specs. A single run can gear your Resto, Guardian, and Balance Druid simultaneously. No other addon does this." },
              { title:"In-game group planning", desc:"Type /wowbis share in your party. The Group Plan tab shows which locations overlap with your party members." },
              { title:"Item tooltips", desc:"Hover any item anywhere in the game — bags, auction house, loot window — to see its BiS status for your spec." },
            ].map(({ title, desc }) => (
              <div key={title} style={{ paddingBottom:"1rem", marginBottom:"1rem", borderBottom:"1px solid var(--bdr)" }}>
                <div style={{ fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".06em", color:"var(--parch)", marginBottom:".35rem" }}>{title}</div>
                <div style={{ fontSize:".82rem", color:"var(--parch-dk)", lineHeight:1.65 }}>{desc}</div>
              </div>
            ))}
            <div style={{ background:"rgba(0,0,0,.2)", border:"1px solid var(--bdr2)", padding:"1rem", marginTop:".25rem" }}>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:".68rem", letterSpacing:".1em", color:"var(--gold)", marginBottom:".75rem" }}>HOW TO INSTALL</div>
              {[
                "Download the zip and extract it",
                "Move the WoWBiSTracker folder to your AddOns directory",
                "Log in — your BiS list loads automatically",
                "Click the minimap button or type /wowbis",
              ].map((s, i) => (
                <div key={s} style={{ display:"flex", gap:".6rem", marginBottom:".5rem", fontSize:".82rem", color:"var(--parch-dk)" }}>
                  <span style={{ color:"var(--gold)", fontFamily:"Cinzel,serif", fontSize:".7rem", flexShrink:0, marginTop:".1rem" }}>{i+1}.</span>
                  <span style={{ lineHeight:1.6 }}>{s}</span>
                </div>
              ))}
              <a href="https://github.com/onyxicca/wowbistracker-addon/releases/tag/v1.0.0" target="_blank" rel="noreferrer" style={{ display:"inline-block", marginTop:".85rem", fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".08em", padding:".45rem 1.1rem", background:"var(--gold)", color:"var(--ink)", textDecoration:"none", fontWeight:700 }}>Download Addon</a>
              <span style={{ display:"block", marginTop:".4rem", fontSize:".72rem", color:"var(--parch-dk)", fontStyle:"italic" }}>Coming to CurseForge soon</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background:"rgba(201,146,42,.06)", border:"1px solid rgba(201,146,42,.25)", padding:"1rem 1.25rem", marginBottom:"2rem", fontSize:".85rem", color:"var(--parch-dk)", lineHeight:1.7 }}>
        <strong style={{ fontFamily:"Cinzel,serif", fontSize:".68rem", letterSpacing:".1em", color:"var(--gold-lt)" }}>USING BOTH?</strong>
        {"  "}The addon exports a code you can paste into the website to sync your in-game progress to the browser view. The website can also export a code back into the addon. Both tools stay in sync without requiring SimC.
      </div>

    </div>
  );
}

export default function App() {
  const [page,    setPage]    = useState("home");
  const [cls,     setCls]     = useState(null);
  const [spec,    setSpec]    = useState(null);
  const [charName, setCharName] = useState("default");
  const goHome  = () => { setPage("home"); setCls(null); setSpec(null); setCharName("default"); };
  const goClass = c  => { setCls(c); setPage("spec"); };
  const goTrack = (sp, cn) => { setSpec(sp); setCharName(cn || "default"); setPage("tracker"); };

  return (
    <>
      <link rel="icon" type="image/png" href="data:image/png;base64,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" />
      <style>{CSS}</style>
      <div className="app">
        <header className="hdr">
          <div className="hdr-in">
            <button className="logo" onClick={goHome}>
              <img src="data:image/png;base64,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" className="logo-icon" alt="" />
              <span className="logo-main">WoW BiS Tracker</span>
            </button>
            <div className="hdr-btns">
              <a className="btn-addon" href="https://github.com/onyxicca/wowbistracker-addon/releases/tag/v1.0.0" target="_blank" rel="noreferrer">⬇ Get the In-Game Addon</a>
              <a className="btn-sup" href="https://embernal.com/pages/support" target="_blank" rel="noreferrer">♥ Support Onyxicca</a>
            </div>
          </div>
        </header>

        {page === "home" && (
          <div className="hero">
            <p className="hero-sub">Plan your BiS list. Track your farm. Beat the reset.</p>

            {page === "home" && (
              <div style={{ display:"flex", justifyContent:"center", gap:"1rem", marginTop:"1.4rem", flexWrap:"wrap" }}>
                {[
                  { icon:"📖", line1:"Browse BiS by", line2:"class & spec", sub:"Community guides, every spec", scrollId:"select-class" },
                  { icon:"🗺", line1:"Plan your", line2:"farm", sub:"Farm Priority · Raid vs Dungeon", scrollId:"select-class" },
                  { icon:"👥", line1:"Group", line2:"planning", sub:"Share farm lists · See who needs what", scrollId:"group-planner" },
                  { icon:"✏️", line1:"Build your", line2:"own list", sub:"Up to 3 options per slot", scrollId:"select-class" },
                  { icon:"🎮", line1:"Track", line2:"in-game", sub:"Free addon · Mini overlay", scrollId:"vs-addon" },
                ].map(({ icon, line1, line2, sub, scrollId, href }) => (
                  <div key={line1+line2}
                    onClick={() => {
                      if (href) { window.open(href, "_blank"); return; }
                      if (scrollId) {
                        const el = document.getElementById(scrollId);
                        if (el) { el.scrollIntoView({ behavior:"smooth", block:"start" }); el.style.outline="2px solid var(--gold)"; setTimeout(()=>{ el.style.outline=""; },1400); }
                      }
                    }}
                    style={{ textAlign:"center", minWidth:"100px", maxWidth:"140px", cursor:"pointer", padding:".65rem .5rem", border:"1px solid var(--bdr)", background:"rgba(201,146,42,.04)", transition:"all .18s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--gold)"; e.currentTarget.style.background="rgba(201,146,42,.10)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--bdr)"; e.currentTarget.style.background="rgba(201,146,42,.04)"; }}
                  >
                    <div style={{ fontSize:"1.5rem", marginBottom:".35rem" }}>{icon}</div>
                    <div style={{ fontFamily:"Cinzel,serif", fontSize:".85rem", color:"var(--gold-lt)", letterSpacing:".07em", lineHeight:1.3 }}>{line1}<br/>{line2}</div>
                    <div style={{ fontSize:".82rem", color:"var(--parch-dk)", fontStyle:"italic", marginTop:".3rem", lineHeight:1.3 }}>{sub}</div>
                    <div style={{ fontSize:".75rem", color:"var(--gold)", marginTop:".35rem", opacity:.7, letterSpacing:".05em" }}>↓ click</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <main className="main">
          {page === "home"    && <Home onSelectClass={goClass} onLoadCharacter={(cls, spec, cn) => { setCls(cls); goTrack(spec, cn); }} />}
          {page === "spec"    && cls  && <SpecPage cls={cls} onBack={goHome} onGo={goTrack} />}
          {page === "tracker" && cls  && spec && (
            <Tracker key={`${cls.id}-${spec.id}-${charName}`} cls={cls} spec={spec} charName={charName} onBack={() => setPage("spec")} />
          )}
        </main>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior:"smooth" })}
          style={{ position:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:200, fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".08em", padding:".45rem .8rem", background:"var(--panel)", border:"1px solid var(--gold)", color:"var(--gold-lt)", cursor:"pointer", clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)", transition:"all .18s", boxShadow:"0 2px 12px rgba(0,0,0,.5)" }}
          onMouseEnter={e=>e.currentTarget.style.background="var(--gold)"}
          onMouseLeave={e=>e.currentTarget.style.background="var(--panel)"}
          title="Back to top"
        >↑ Top</button>

        <button
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior:"smooth" })}
          style={{ position:"fixed", bottom:"1.5rem", right:"5.5rem", zIndex:200, fontFamily:"Cinzel,serif", fontSize:".72rem", letterSpacing:".08em", padding:".45rem .8rem", background:"var(--panel)", border:"1px solid var(--bdr2)", color:"var(--parch-dk)", cursor:"pointer", clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)", transition:"all .18s", boxShadow:"0 2px 12px rgba(0,0,0,.5)" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--bdr2)"}
          title="Go to bottom"
        >↓ Bot</button>

        <footer className="ftr">
          <span>Art &amp; Design by <a href="https://embernal.com" style={{ color: "var(--gold)", textDecoration: "none" }} target="_blank" rel="noreferrer">Onyxicca</a></span>
          <span>Not affiliated with Blizzard Entertainment</span>
          <span>wowbistracker.com</span>
        </footer>
      </div>
    </>
  );
}
