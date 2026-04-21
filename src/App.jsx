import { useState, useCallback, useEffect, useRef } from "react";
import seasonManifest from "./data/season_manifest_midnight_s1.json";

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


const WOW_ICON_BASE = "https://wow.zamimg.com/images/wow/icons/medium/";

function SpecIcon({ spec, size = 18 }) {
  const iconSrc = !spec?.icon ? null : (String(spec.icon).startsWith("data:image/") || String(spec.icon).startsWith("http") ? spec.icon : `${WOW_ICON_BASE}${spec.icon}.jpg`);
  if (!iconSrc) return null;
  return (
    <img
      src={iconSrc}
      alt={spec.name}
      width={size}
      height={size}
      loading="lazy"
      style={{
        width: size,
        height: size,
        display: "block",
        borderRadius: "6px",
        objectFit: "contain",
        background: "transparent",
        boxShadow: "0 0 0 1px rgba(0,0,0,.35)",
        flex: "0 0 auto",
      }}
    />
  );
}

const CLASSES = [
  {
    id:"death-knight", name:"Death Knight", color:"#C41E3A",
    roles:["Tank","DPS"], armor:"Plate",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"blood",    name:"Blood",  role:"Tank",      icon:"spell_deathknight_bloodpresence"},
      {id:"frost-dk", name:"Frost",  role:"DPS", icon:"spell_deathknight_frostpresence"},
      {id:"unholy",   name:"Unholy", role:"DPS", icon:"spell_deathknight_unholypresence"},
    ],
  },
  {
    id:"demon-hunter", name:"Demon Hunter", color:"#A330C9",
    roles:["Tank","DPS"], armor:"Leather",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"havoc",     name:"Havoc",     role:"DPS",  icon:"ability_demonhunter_specdps"},
      {id:"vengeance", name:"Vengeance", role:"Tank",        icon:"ability_demonhunter_spectank"},
      {id:"devourer",  name:"Devourer",  role:"DPS", icon:"classicon_demonhunter_void"},
    ],
  },
  {
    id:"druid", name:"Druid", color:"#FF7C0A",
    roles:["Tank","DPS","Healer"], armor:"Leather",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"balance",           name:"Balance",     role:"DPS", icon:"spell_nature_starfall"},
      {id:"feral",             name:"Feral",        role:"DPS",  icon:"ability_druid_catform"},
      {id:"guardian",          name:"Guardian",     role:"Tank",        icon:"ability_racial_bearform"},
      {id:"restoration-druid", name:"Restoration",  role:"Healer",      icon:"spell_nature_healingtouch"},
    ],
  },
  {
    id:"evoker", name:"Evoker", color:"#33937F",
    roles:["DPS","Healer"], armor:"Mail",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"devastation",  name:"Devastation",  role:"DPS", icon:"classicon_evoker_devastation"},
      {id:"preservation", name:"Preservation", role:"Healer",      icon:"classicon_evoker_preservation"},
      {id:"augmentation", name:"Augmentation", role:"DPS", icon:"classicon_evoker_augmentation"},
    ],
  },
  {
    id:"hunter", name:"Hunter", color:"#AAD372",
    roles:["DPS"], armor:"Mail",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"beast-mastery", name:"Beast Mastery", role:"DPS", icon:"ability_hunter_bestialdiscipline"},
      {id:"marksmanship",  name:"Marksmanship",  role:"DPS", icon:"ability_marksmanship"},
      {id:"survival",      name:"Survival",       role:"DPS",  icon:"ability_hunter_camouflage"},
    ],
  },
  {
    id:"mage", name:"Mage", color:"#3FC7EB",
    roles:["DPS"], armor:"Cloth",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"arcane",     name:"Arcane", role:"DPS", icon:"spell_holy_magicalsentry"},
      {id:"fire",       name:"Fire",   role:"DPS", icon:"spell_fire_firebolt02"},
      {id:"frost-mage", name:"Frost",  role:"DPS", icon:"spell_frost_frostbolt02"},
    ],
  },
  {
    id:"monk", name:"Monk", color:"#00FF98",
    roles:["Tank","DPS","Healer"], armor:"Leather",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"brewmaster", name:"Brewmaster", role:"Tank",      icon:"spell_monk_brewmaster_spec"},
      {id:"mistweaver", name:"Mistweaver", role:"Healer",    icon:"spell_monk_mistweaver_spec"},
      {id:"windwalker", name:"Windwalker", role:"DPS", icon:"spell_monk_windwalker_spec"},
    ],
  },
  {
    id:"paladin", name:"Paladin", color:"#F48CBA",
    roles:["Tank","DPS","Healer"], armor:"Plate",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"holy-pala",       name:"Holy",        role:"Healer",    icon:"paladin_holy"},
      {id:"protection-pala", name:"Protection",  role:"Tank",      icon:"ability_paladin_shieldofthetemplar"},
      {id:"retribution",     name:"Retribution", role:"DPS", icon:"spell_holy_auraoflight"},
    ],
  },
  {
    id:"priest", name:"Priest", color:"#E8E0D0",
    roles:["DPS","Healer"], armor:"Cloth",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"discipline",  name:"Discipline", role:"Healer",     icon:"spell_holy_powerwordshield"},
      {id:"holy-priest", name:"Holy",        role:"Healer",     icon:"spell_holy_guardianspirit"},
      {id:"shadow",      name:"Shadow",      role:"DPS", icon:"spell_shadow_shadowwordpain"},
    ],
  },
  {
    id:"rogue", name:"Rogue", color:"#FFF468",
    roles:["DPS"], armor:"Leather",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"assassination", name:"Assassination", role:"DPS", icon:"ability_rogue_deadlybrew"},
      {id:"outlaw",        name:"Outlaw",         role:"DPS", icon:"ability_rogue_waylay"},
      {id:"subtlety",      name:"Subtlety",       role:"DPS", icon:'data:image/png;base64,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'},
    ],
  },
  {
    id:"shaman", name:"Shaman", color:"#0070DD",
    roles:["DPS","Healer"], armor:"Mail",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"elemental",        name:"Elemental",   role:"DPS", icon:'data:image/png;base64,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'},
      {id:"enhancement",      name:"Enhancement", role:"DPS",  icon:'data:image/png;base64,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'},
      {id:"restoration-sham", name:"Restoration", role:"Healer",     icon:"spell_nature_magicimmunity"},
    ],
  },
  {
    id:"warlock", name:"Warlock", color:"#8788EE",
    roles:["DPS"], armor:"Cloth",
    weapons:["Main Hand + Off Hand"],
    specs:[
      {id:"affliction",  name:"Affliction",  role:"DPS", icon:"spell_shadow_deathcoil"},
      {id:"demonology",  name:"Demonology",  role:"DPS", icon:"spell_shadow_metamorphosis"},
      {id:"destruction", name:"Destruction", role:"DPS", icon:'data:image/png;base64,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'},
    ],
  },
  {
    id:"warrior", name:"Warrior", color:"#C69B3A",
    roles:["Tank","DPS"], armor:"Plate",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"arms",           name:"Arms",       role:"DPS", icon:"ability_warrior_savageblow"},
      {id:"fury",           name:"Fury",       role:"DPS", icon:"ability_warrior_innerrage"},
      {id:"protection-war", name:"Protection", role:"Tank",      icon:"inv_shield_06"},
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
.hdr-in{max-width:1280px;margin:0 auto;padding:.45rem 1.1rem;display:flex;align-items:center;justify-content:space-between;gap:.55rem;flex-wrap:nowrap}
.logo{display:flex;align-items:center;gap:.42rem;cursor:pointer;border:none;background:none;padding:0;min-width:0;flex:1 1 auto;overflow:hidden}
.logo-main{font-family:'Cinzel Decorative',serif;font-size:1rem;color:var(--gold-lt);text-shadow:0 0 20px rgba(201,146,42,.25);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.logo-exp{font-family:'Cinzel',serif;font-size:.75rem;letter-spacing:.12em;color:var(--void);text-transform:uppercase}
.logo-icon{width:28px;height:28px;object-fit:contain;flex:0 0 auto}
.hdr-btns{display:flex;align-items:center;gap:.35rem;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end}
.btn-site{font-family:'Cinzel',serif;font-size:.75rem;letter-spacing:.08em;padding:.4rem 1.1rem;background:transparent;border:1px solid var(--gold);color:var(--gold-lt);cursor:pointer;transition:all .18s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);text-decoration:none;display:inline-block}
.btn-site:hover{background:var(--gold);color:var(--ink)}
.btn-addon{font-family:'Cinzel',serif;font-size:.62rem;letter-spacing:.06em;padding:.32rem .62rem;background:rgba(201,146,42,.12);border:1px solid var(--gold);color:var(--gold-lt);text-decoration:none;transition:all .15s;white-space:nowrap;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);display:inline-block}.btn-addon:hover{background:var(--gold);color:var(--ink)}.btn-sup{font-family:'Cinzel',serif;font-size:.64rem;letter-spacing:.06em;padding:.32rem .72rem;background:rgba(155,26,42,.15);border:1px solid var(--crimson);color:#ff8fa0;cursor:pointer;transition:all .18s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);text-decoration:none;display:inline-block}
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
.si{width:58px;height:58px;display:flex;align-items:center;justify-content:center;line-height:0;flex:0 0 58px}
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
.tbtn.sec{background:#000;border-color:#000;color:var(--gold-lt);font-weight:700}
.tbtn.sec:hover{background:#16110a;border-color:var(--gold)}
.tbtn.dan{background:transparent;border-color:var(--crimson);color:#ff8fa0}
.tbtn.dan:hover{background:rgba(155,26,42,.2)}

.ftr{border-top:1px solid var(--bdr);padding:1.25rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;font-size:.78rem;color:var(--parch-dk);opacity:.6}

.rank-inputs select,
.rank-inputs option {
  background: #120a05;
  color: var(--gold-lt);
  border: 1px solid var(--bdr);
}
.rank-inputs select:focus {
  outline: none;
  box-shadow: 0 0 0 1px rgba(212, 163, 69, 0.35);
}

.spin{display:inline-block;width:16px;height:16px;border:2px solid rgba(167,139,250,.2);border-top-color:#a78bfa;border-radius:50%;animation:rot .75s linear infinite;vertical-align:middle;margin-right:.4rem}
@keyframes rot{to{transform:rotate(360deg)}}
.fade{animation:fadeup .25s ease}
@keyframes fadeup{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

@media print {
  @page { margin: 1.2cm; size: A4; }
  :root {
    --parch: #000; --parch-dk: #111; --gold: #000; --gold-lt: #000;
    --bg: #fff; --bg2: #fff; --panel: #fff; --bdr: #000; --bdr2: #000;
    --crimson: #000; --void: #000; --ink: #000;
  }
  .hdr, .hero, .bis-bar, .bis-mode-bar, .tactions, .back, .sug-panel, .ftr, .farm-priority-section, .no-print, [data-noprint] { display: none !important; }
  body, html, .app { background: #fff !important; }
  body { color: #000 !important; }
  * { background: transparent !important; box-shadow: none !important; text-shadow: none !important; clip-path: none !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  input, textarea, select, button { -webkit-text-fill-color:#000 !important; color:#000 !important; opacity:1 !important; }
  input::placeholder, textarea::placeholder { color: transparent !important; }
  .tracker { max-width: 100%; }
  .info-bar { display: flex !important; flex-wrap: wrap; gap: .4rem; margin-bottom: .8rem; border: 1.5px solid #000 !important; padding: .5rem; }
  .ib { flex: 1; min-width: 80px; border: none !important; padding: .2rem .4rem; }
  .ib-l { font-size: .58rem !important; color: #333 !important; display: block; letter-spacing: .1em; text-transform: uppercase; font-family: Cinzel, serif; }
  .ib-v { font-size: .9rem !important; color: #000 !important; font-weight: 700; }
  .gear-grid { display: grid !important; grid-template-columns: 1fr 1fr; gap: .35rem; }
  .slot-wrap { break-inside: avoid; margin-bottom: .25rem; }
  .slot-lbl { font-size: .6rem !important; color: #222 !important; letter-spacing: .1em; text-transform: uppercase; font-family: Cinzel, serif; padding-left: 2px; display: block; margin-bottom: 2px; }
  .slot-entry, .rank-block { display: flex !important; border: 1.5px solid #000 !important; }
  .slot-fields, .rank-inputs { flex: 1; }
  .sf-name { font-size: .82rem !important; color: #000 !important; padding: .32rem .45rem; display: block; border-bottom: 1px solid #000 !important; font-weight: 700; white-space: normal !important; overflow: visible !important; text-overflow: clip !important; line-height: 1.22 !important; min-height: 2.1em; word-break: break-word; }
  .sf-src { font-size: .76rem !important; color: #000 !important; padding: .24rem .45rem; display: block; font-style: normal !important; white-space: normal !important; overflow: visible !important; text-overflow: clip !important; line-height: 1.2 !important; word-break: break-word; }
  .slot-chk { width: 26px; flex-shrink: 0; border-left: 1px solid #000 !important; display: flex !important; align-items: center; justify-content: center; font-size: 1rem; }
  .slot-chk:not(.done) { color: transparent !important; }
  .slot-chk.done, .slot-chk.soft { color: #000 !important; background: transparent !important; }
  .sub-sh { font-size: .66rem !important; color: #111 !important; letter-spacing: .15em; text-transform: uppercase; font-family: Cinzel, serif; border-bottom: 1px solid #000 !important; padding-bottom: .2rem; margin: .6rem 0 .3rem; display: block !important; }
  .rank-badge, .rank-set-btn, .rank-have, .slot-track-row button, .rank-block button {
    color: #000 !important; background: #fff !important; border: 1.5px solid #000 !important; font-weight: 700 !important; opacity:1 !important;
  }
  .rank-badge.r1, .rank-badge.r2, .rank-badge.r3 { color:#000 !important; border-color:#000 !important; }
  .slot-track-row button[data-selected="true"], .rank-block button[data-selected="true"] {
    border: 3px solid #000 !important; color: #000 !important; font-weight: 800 !important; background:#fff !important;
  }
  .rank-active, .rank-block.rank-active { border: 2px solid #000 !important; }
  .sf-name, .sf-src, .rank-inputs input { color: #000 !important; font-weight:700 !important; opacity:1 !important; }
  .rank-inputs select, .rank-inputs datalist { display:none !important; }
  .sf-src { font-style: normal !important; }
  .tbtn.sec { background:#fff !important; color:#000 !important; border:2px solid #000 !important; }
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
const SOURCE_TYPE_OPTIONS = ["", "Raid", "Dungeon", "Other"];
const SEASON_MANIFEST = seasonManifest;
const CURRENT_SEASON_DUNGEONS = SEASON_MANIFEST.dungeons.map(v => v.name);
const CURRENT_SEASON_RAIDS = SEASON_MANIFEST.raids.map(v => v.name);
const OTHER_SOURCE_OPTIONS = SEASON_MANIFEST.otherSources.map(v => v.name);
function getSpecificSourceOptions(sourceType) {
  if (sourceType === 'Raid') return CURRENT_SEASON_RAIDS;
  if (sourceType === 'Dungeon') return CURRENT_SEASON_DUNGEONS;
  if (sourceType === 'Other') return OTHER_SOURCE_OPTIONS;
  return [];
}

function inferSourceType(src) {
  const s = (src || '').toLowerCase();
  if (s.includes('raid') || CURRENT_SEASON_RAIDS.some(v => s.includes(v.toLowerCase()))) return 'Raid';
  if (s.includes('dungeon') || CURRENT_SEASON_DUNGEONS.some(v => s.includes(v.toLowerCase()))) return 'Dungeon';
  if (OTHER_SOURCE_OPTIONS.some(v => s.includes(v.toLowerCase()))) return 'Other';
  return '';
}
function inferSourceDetail(src, type) {
  const s = (src || '').toLowerCase();
  const pool = type === 'Raid' ? CURRENT_SEASON_RAIDS : type === 'Dungeon' ? CURRENT_SEASON_DUNGEONS : OTHER_SOURCE_OPTIONS;
  return pool.find(v => s.includes(v.toLowerCase())) || '';
}
function buildSourceLabel(type, detail) {
  if (!type && !detail) return '';
  if ((type === 'Raid' || type === 'Dungeon') && detail) return detail;
  return detail || type || '';
}

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
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".35rem", marginBottom:".25rem" }}>
                <select className="sf-src" value={r.sourceType || inferSourceType(r.src)} onChange={e => {
                  const t = e.target.value;
                  const detail = inferSourceDetail(r.src, t);
                  upRank(idx, "sourceType", t);
                  upRank(idx, "src", buildSourceLabel(t, detail));
                }}>
                  {SOURCE_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt || 'Source Type'}</option>)}
                </select>
                <select className="sf-src" value={r.sourceDetail || inferSourceDetail(r.src, r.sourceType || inferSourceType(r.src))} onChange={e => {
                  const detail = e.target.value;
                  const t = r.sourceType || inferSourceType(r.src);
                  upRank(idx, "sourceDetail", detail);
                  upRank(idx, "src", buildSourceLabel(t, detail));
                }}>
                  <option value="">Specific source</option>
                  {((r.sourceType || inferSourceType(r.src)) === 'Raid' ? CURRENT_SEASON_RAIDS : (r.sourceType || inferSourceType(r.src)) === 'Dungeon' ? CURRENT_SEASON_DUNGEONS : OTHER_SOURCE_OPTIONS).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <input className="sf-src" style={{ gridColumn:"1 / span 2" }} list={`src-list-${id}-${idx}`} placeholder="Final source line..." value={r.src || ""} onChange={e => upRank(idx, "src", e.target.value)} />
                <datalist id={`src-list-${id}-${idx}`}>
                  {CURRENT_SEASON_RAIDS.map(v => <option key={v} value={`${v} (Raid)`} />)}
                  {CURRENT_SEASON_DUNGEONS.map(v => <option key={v} value={`Dungeon • ${v}`} />)}
                  {OTHER_SOURCE_OPTIONS.map(v => <option key={v} value={v} />)}
                </datalist>
              </div>
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

function Tracker({ cls, spec, charName, initialMode = "", onBack }) {
  const storageKey = `bis-${cls.id}-${spec.id}-${charName || "default"}`;
  const modeStorageKey = (mode) => `${storageKey}-${mode}`;
  const modeLabel = (mode) => mode === "custom" ? "Custom Builder" : mode === "community" ? "Community BiS" : "Character Scan";
  const isPlaceholderName = (name) => {
    const n = (name || "").trim();
    return !n || /^x+$/i.test(n) || /^unknown$/i.test(n);
  };
  const readModeData = (mode) => {
    try {
      const modeKey = modeStorageKey(mode);
      const modeRaw = localStorage.getItem(modeKey);
      return modeRaw ? (JSON.parse(modeRaw) || {}) : {};
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
    try { return initialMode || localStorage.getItem(`bismode-${storageKey}`) || "community"; } catch { return initialMode || "community"; }
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
  const [saveState, setSaveState] = useState('saved');
  const sugRef = useRef(null);
  useEffect(() => {
    if (!initialMode) return;
    const next = readModeData(initialMode);
    setBisMode(initialMode);
    setData(next);
    setWMode(next.mainhand || next.offhand ? "1h" : "2h");
    try { localStorage.setItem(`bismode-${storageKey}`, initialMode); } catch {}
  }, [initialMode, storageKey]);


  const writeModeData = useCallback((mode, next) => {
    try {
      localStorage.setItem(modeStorageKey(mode), JSON.stringify(next || {}));
      setSaveState('saved');
      return true;
    } catch {
      setSaveState('error');
      return false;
    }
  }, [storageKey]);

  const SLOT_LABELS = {
    head:"Head", neck:"Neck", shoulders:"Shoulders", back:"Cloak",
    chest:"Chest", wrist:"Wrist", hands:"Hands", waist:"Belt",
    legs:"Legs", feet:"Boots", finger1:"Ring 1", finger2:"Ring 2",
    trinket1:"Trinket 1", trinket2:"Trinket 2",
    weapon:"Weapon", offhand:"Off Hand", mainhand:"Main Hand", weapon2h:"2H Weapon",
  };

  useEffect(() => {
    setSaveState('saving');
    const t = setTimeout(() => {
      try {
        localStorage.setItem(modeStorageKey(bisMode), JSON.stringify(data || {}));
        localStorage.setItem(`bismode-${storageKey}`, bisMode);
        if (hasMeaningfulTrackerData(data || {})) registerCharacterSave(cls.id, spec.id, charName || "default", bisMode);
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    }, 140);
    return () => clearTimeout(t);
  }, [data, storageKey, bisMode]);

  const upSlot = useCallback((id, val) => {
    setSaveState('saving');
    setData(p => {
      const next = { ...p, [id]: val };
      return next;
    });
  }, [bisMode]);

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
            itemId: r?.itemId ? String(r.itemId).replace(/[^0-9]/g, "") : "",
          }))
          .filter(r => r.name);
        if (ranked.length) {
          rankBlob = "#T" + String(activeIdx + 1) + "#" + ranked.map(r => [r.name, r.src, r.have, r.itemId].join("~")).join("^");
        }
      }
      const n = cleanField(itemName);
      if (n) {
        const s = cleanField(itemSrc || "Unknown");
        const acquired = d.done ? "1" : "0";
        const trackCode = d.track ? d.track[0].toLowerCase() : "n";
        parts.push(slotNum + ":" + n + ":" + s + ":" + acquired + ":" + trackCode + rankBlob);
      }
    });
    if (!parts.length) {
      const hasRankedDraft = bisMode === "custom" && allSlotIds.some(id => (data[id]?.ranks || []).some(r => (r?.name || "").trim().length > 0));
      if (!hasRankedDraft) return null;
    }
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
    writeModeData(bisMode, nd)
    setSugs(null);
  };

  const applyOne = (k, v) => {
    const mapped = mapKey(k, sugs?.slots || {});
    setData(p => {
      const next = { ...p, [mapped]: { name: v.name, src: v.source, done: false } };
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
                w.document.write(`<!DOCTYPE html><html><head><title>${charLabel}${cls.name} ${spec.name} Farm Priority</title><style>body{font-family:Georgia,serif;max-width:700px;margin:2rem auto;color:#000;background:#fff;}h1{font-family:serif;font-size:1.1rem;border-bottom:2px solid #000;padding-bottom:.4rem;color:#000;}h2{font-size:.9rem;color:#000;margin:.85rem 0 .25rem;font-family:serif;font-weight:700;}p{margin:.2rem 0;font-size:.88rem;color:#000;line-height:1.45;}.meta{font-size:.74rem;color:#000;font-weight:600;}strong,b{color:#000;}@media print{body{margin:.5in;color:#000;background:#fff;}}</style></head><body><h1>${charLabel}${cls.name} ${spec.name} — Farm Priority</h1><p class="meta">Midnight Season 1 &middot; Target: ${targetTrack} &middot; ${new Date().toLocaleDateString()}</p>${rowsHtml}<p class="meta" style="margin-top:2rem;border-top:1px solid #000;padding-top:.4rem;">wowbistracker.com</p></body></html>`);
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

      <div className="no-print" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'.75rem', margin:'-.2rem 0 .65rem' }}>
        <div style={{ fontSize:'.72rem', color:'var(--parch-dk)' }}>Current mode: <strong style={{ color:'var(--gold-lt)' }}>{modeLabel(bisMode)}</strong></div>
        <div style={{ fontSize:'.7rem', color: saveState === 'error' ? '#ff8fa0' : saveState === 'saving' ? 'var(--gold-lt)' : 'var(--parch-dk)' }}>
          {saveState === 'error' ? 'Save failed in this browser' : saveState === 'saving' ? 'Saving...' : 'Saved locally'}
        </div>
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
            Build your own ranked list — up to 3 options per slot. Community, Character Scan, and Custom Builder now live under one character card with separate mode saves. Tip: click <strong style={{color:"var(--gold-lt)"}}>Load BiS Suggestions → Apply All</strong> first to pre-fill a base list, then override individual slots with your own research. For custom sources, use clear labels like <strong style={{color:"var(--gold-lt)"}}>Raid</strong>, <strong style={{color:"var(--gold-lt)"}}>Dungeon</strong>, <strong style={{color:"var(--gold-lt)"}}>Delves</strong>, <strong style={{color:"var(--gold-lt)"}}>World Quests</strong>, <strong style={{color:"var(--gold-lt)"}}>Renown</strong>, <strong style={{color:"var(--gold-lt)"}}>Prey</strong>, <strong style={{color:"var(--gold-lt)"}}>Crafted</strong>, or <strong style={{color:"var(--gold-lt)"}}>PvP</strong>. Export sends the active mode only.
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
                    try { localStorage.setItem(modeStorageKey(bisMode), JSON.stringify(next)); } catch {}
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
        <button className="tbtn dan" onClick={() => { if (window.confirm("Clear all entries for this mode?")) { setData({}); try { localStorage.removeItem(modeStorageKey(bisMode)); unregisterCharacterSave(cls.id, spec.id, charName || "default", bisMode); setSaveState('saved'); } catch {} } }}>Clear All</button>
        <button className="tbtn pri" onClick={() => {
          if (writeModeData(bisMode, data || {})) {
            try { localStorage.setItem(`bismode-${storageKey}`, bisMode); } catch {}
            if (hasMeaningfulTrackerData(data || {})) registerCharacterSave(cls.id, spec.id, charName || "default", bisMode);
            alert(`${modeLabel(bisMode)} saved.`);
          } else {
            alert("Could not save this list in your browser.");
          }
        }}>{bisMode === 'custom' ? 'Save Custom' : bisMode === 'community' ? 'Save Community' : 'Save Scan'}</button>
        <button className="tbtn sec" onClick={() => {
          const code = exportForAddon();
          if (!code) { alert("Nothing exportable found yet for this mode. Load suggestions only previews them. Click Apply All, or enter and save at least one real item before exporting."); return; }
          window.__wowbisExportCode = code;
          const modal = document.createElement("div");
          modal.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;align-items:center;justify-content:center;";
          const inner = document.createElement("div");
          inner.style.cssText = "background:#150f08;border:1px solid #c9922a;padding:1.5rem;max-width:540px;width:90%;font-family:Cinzel,serif;";
          inner.innerHTML = `<div style="font-size:.75rem;letter-spacing:.15em;color:#c9922a;margin-bottom:.75rem">EXPORT FOR ADDON</div><div style="font-size:.85rem;color:#c8a96a;margin-bottom:.75rem;font-family:Crimson Pro,serif;line-height:1.6;">Copy this code and paste it into the WoW BiS Tracker addon in-game using the Import BiS button. This export contains only the active mode.</div>`;
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
        <button className="tbtn sec" onClick={() => window.print()} style={{ borderWidth:'2px', boxShadow:'inset 0 0 0 1px rgba(255,255,255,.04)' }}>🖨 Print / PDF</button>
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
    const name = splitSaveLabel(charName.trim() || "default").base || "default";
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
            <span className="si"><SpecIcon spec={s} size={42} /></span>
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


const SAVE_MODE_ORDER = ["community","custom","simc","scan"];
function splitSaveLabel(charName) {
  const raw = String(charName || "default").trim() || "default";
  const m = raw.match(/^(.*?)(?:[-_ ](community|custom|simc|scan))?$/i);
  let base = (m?.[1] || raw || "default").trim().replace(/[-_ ]+$/, "");
  base = base.replace(/(?:[-_ ]+(community|custom|simc|scan))+$/i, "").trim() || "default";
  const mode = (m?.[2] || "community").toLowerCase();
  return { base, mode };
}
function modeNice(m) {
  return ({ community:"Community", custom:"Custom", simc:"SimC", scan:"Scan" }[m] || m);
}

const SAVE_REGISTRY_KEY = "wbt-save-registry-v3";
function readSaveRegistry() {
  try {
    const raw = localStorage.getItem(SAVE_REGISTRY_KEY);
    return raw ? JSON.parse(raw) || {} : {};
  } catch {
    return {};
  }
}
function writeSaveRegistry(reg) {
  try {
    localStorage.setItem(SAVE_REGISTRY_KEY, JSON.stringify(reg || {}));
    return true;
  } catch {
    return false;
  }
}
function registerCharacterSave(clsId, specId, charBase, mode) {
  const base = (charBase || "default").trim() || "default";
  const reg = readSaveRegistry();
  if (!reg[base]) reg[base] = { name: base, specs: {} };
  const specKey = `${clsId}||${specId}`;
  if (!reg[base].specs[specKey]) reg[base].specs[specKey] = { clsId, specId, modes: {} };
  reg[base].specs[specKey].modes[mode] = true;
  writeSaveRegistry(reg);
}
function unregisterCharacterSave(clsId, specId, charBase, mode) {
  const base = (charBase || "default").trim() || "default";
  const reg = readSaveRegistry();
  const specKey = `${clsId}||${specId}`;
  if (!reg[base]?.specs?.[specKey]) return;
  delete reg[base].specs[specKey].modes[mode];
  if (!Object.keys(reg[base].specs[specKey].modes || {}).length) delete reg[base].specs[specKey];
  if (!Object.keys(reg[base].specs || {}).length) delete reg[base];
  writeSaveRegistry(reg);
}

function hasMeaningfulTrackerData(data) {
  if (!data || typeof data !== "object") return false;
  return Object.values(data).some(d => {
    if (!d || typeof d !== "object") return false;
    if ((d?.name || "").trim()) return true;
    if ((d?.src || "").trim()) return true;
    if (d?.done || d?.track) return true;
    if (Array.isArray(d?.ranks)) {
      return d.ranks.some(r => ((r?.name || "").trim() || (r?.src || "").trim() || r?.have));
    }
    return false;
  });
}
function getTrackerCounts(data) {
  if (!data || typeof data !== "object") return { slotCount: 0, acquired: 0 };
  const values = Object.values(data).filter(d => {
    if (!d || typeof d !== "object") return false;
    if ((d?.name || "").trim()) return true;
    if (Array.isArray(d?.ranks) && d.ranks.some(r => (r?.name || "").trim())) return true;
    return false;
  });
  return {
    slotCount: values.length,
    acquired: values.filter(d => d?.done).length,
  };
}
function getSavedCharacters() {
  const bestByKey = new Map();

  const collect = (cls, spec, base, mode, key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    let data;
    try { data = JSON.parse(raw); } catch { return; }
    if (!hasMeaningfulTrackerData(data)) return;
    const { slotCount, acquired } = getTrackerCounts(data);
    const dedupeKey = `${base}||${cls.id}||${spec.id}||${mode}`;
    const candidate = { key, cls, spec, charName: base, slotCount, acquired, mode };
    const existing = bestByKey.get(dedupeKey);
    if (!existing || candidate.slotCount > existing.slotCount || candidate.acquired > existing.acquired) {
      bestByKey.set(dedupeKey, candidate);
    }
  };

  const parseAnyBisKey = (key) => {
    if (!key || !key.startsWith("bis-")) return null;
    for (const cls of CLASSES) {
      const clsPrefix = `bis-${cls.id}-`;
      if (!key.startsWith(clsPrefix)) continue;
      const rest = key.slice(clsPrefix.length);
      for (const spec of [...cls.specs].sort((a,b)=>b.id.length-a.id.length)) {
        const specPrefix = `${spec.id}-`;
        if (!rest.startsWith(specPrefix)) continue;
        let tail = rest.slice(specPrefix.length);
        let mode = "community";
        const mm = tail.match(/^(.*?)-(community|custom|simc|scan)$/i);
        if (mm) {
          tail = mm[1];
          mode = mm[2].toLowerCase();
        }
        const base = splitSaveLabel(tail || "default").base || "default";
        return { cls, spec, base, mode, key };
      }
    }
    return null;
  };

  try {
    const registry = readSaveRegistry();
    Object.entries(registry || {}).forEach(([base, entry]) => {
      Object.values(entry?.specs || {}).forEach((specEntry) => {
        const cls = CLASSES.find(c => c.id === specEntry.clsId);
        const spec = cls?.specs?.find(s => s.id === specEntry.specId);
        if (!cls || !spec) return;
        SAVE_MODE_ORDER.forEach((mode) => {
          if (!specEntry?.modes?.[mode]) return;
          const key = `bis-${cls.id}-${spec.id}-${base}-${mode}`;
          collect(cls, spec, base, mode, key);
        });
      });
    });
  } catch {}

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const parsed = parseAnyBisKey(key);
      if (!parsed) continue;
      collect(parsed.cls, parsed.spec, parsed.base, parsed.mode, parsed.key);
    }
  } catch {}

  return Array.from(bestByKey.values()).sort((a, b) => a.charName.localeCompare(b.charName) || a.cls.name.localeCompare(b.cls.name) || a.spec.name.localeCompare(b.spec.name));
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
  const groupedSaves = (() => {
    const grouped = {};
    allSaved.forEach(entry => {
      const { base, mode } = splitSaveLabel(entry.charName);
      const key = `${base}||${entry.cls.id}`;
      if (!grouped[key]) grouped[key] = { key, base, cls: entry.cls, saves: {} };
      grouped[key].saves[mode] = entry;
    });
    return Object.values(grouped);
  })();
  const [selectedGroupKey, setSelectedGroupKey] = useState("");
  const [groupMode, setGroupMode] = useState({});
  const activeGroup = groupedSaves.find(g => g.key === selectedGroupKey) || groupedSaves[0];
  const activeMode = activeGroup ? (groupMode[activeGroup.key] || (activeGroup.saves.community ? "community" : Object.keys(activeGroup.saves)[0])) : "";
  const selectedSaved = activeGroup ? activeGroup.saves[activeMode] : null;
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

      {groupedSaves.length > 0 && (
        <div style={{ background:"rgba(201,146,42,.07)", border:"1px solid var(--bdr2)", padding:".75rem .9rem", marginBottom:"1rem" }}>
          <div style={{ fontFamily:"Cinzel,serif", fontSize:".65rem", letterSpacing:".1em", color:"var(--gold)", marginBottom:".5rem" }}>STEP 1 — COPY YOUR FARM CODE</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:".55rem", marginBottom:".7rem" }}>
            {groupedSaves.map(group => {
              const defaultMode = group.saves.community ? "community" : Object.keys(group.saves)[0];
              const active = groupMode[group.key] || defaultMode;
              const entry = group.saves[active] || group.saves[defaultMode];
              return (
                <div key={group.key} style={{ border:`1px solid ${group.cls.color}44`, background:"rgba(0,0,0,.12)", padding:".65rem .75rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:".4rem", marginBottom:".35rem" }}>
                    <div style={{ fontFamily:"Cinzel,serif", fontSize:".78rem", color:group.cls.color }}>{group.base === "default" ? group.cls.name : group.base}</div>
                    <button onClick={() => setSelectedGroupKey(group.key)} style={{ marginLeft:"auto", fontFamily:"Cinzel,serif", fontSize:".64rem", letterSpacing:".05em", padding:".18rem .5rem", background:selectedGroupKey === group.key || (!selectedGroupKey && groupedSaves[0]?.key === group.key) ? "var(--gold)" : "transparent", color:selectedGroupKey === group.key || (!selectedGroupKey && groupedSaves[0]?.key === group.key) ? "var(--ink)" : "var(--gold-lt)", border:"1px solid var(--gold)", cursor:"pointer" }}>Use</button>
                  </div>
                  <div style={{ fontSize:".7rem", color:"var(--parch-dk)", marginBottom:".4rem" }}>{group.cls.name}</div>
                  <div style={{ display:"flex", gap:".35rem", alignItems:"center", flexWrap:"wrap" }}>
                    <select value={active} onChange={e => setGroupMode(prev => ({ ...prev, [group.key]: e.target.value }))} style={{ background:"var(--bg2)", border:"1px solid var(--bdr2)", color:"var(--parch)", padding:".2rem .45rem", fontFamily:"Cinzel,serif", fontSize:".66rem" }}>
                      {SAVE_MODE_ORDER.filter(mode => group.saves[mode]).map(mode => <option key={mode} value={mode}>{modeNice(mode)}</option>)}
                    </select>
                    <div style={{ fontSize:".72rem", color:"var(--parch)" }}><span style={{ display:"inline-flex", alignItems:"center", gap:".4rem" }}><SpecIcon spec={entry?.spec} size={18} /><span>{entry?.spec?.name}</span></span></div>
                  </div>
                </div>
              );
            })}
          </div>
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



function WeeklyResetPanel({ compact = false }) {
  const [resetRegion, setResetRegion] = useState("NA");
  const getNextReset = useCallback((region) => {
    const now = new Date();
    const next = new Date(now);
    if (region === "NA") {
      next.setUTCHours(15, 0, 0, 0); // Tuesday 8am Pacific approx standard reference
      const day = next.getUTCDay();
      let add = (2 - day + 7) % 7;
      if (add === 0 && now >= next) add = 7;
      next.setUTCDate(next.getUTCDate() + add);
    } else {
      next.setUTCHours(7, 0, 0, 0); // Wednesday 8am CET approx standard reference
      const day = next.getUTCDay();
      let add = (3 - day + 7) % 7;
      if (add === 0 && now >= next) add = 7;
      next.setUTCDate(next.getUTCDate() + add);
    }
    return next;
  }, []);
  const formatRemaining = useCallback((target) => {
    const ms = Math.max(0, target - new Date());
    const total = Math.floor(ms / 1000);
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  }, []);
  const [timeLeft, setTimeLeft] = useState(() => formatRemaining(getNextReset("NA")));
  useEffect(() => {
    const tick = () => setTimeLeft(formatRemaining(getNextReset(resetRegion)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [resetRegion, getNextReset, formatRemaining]);

  return (
    <div id="weekly-reset" style={{ background:"var(--panel)", border:"1px solid var(--bdr2)", padding: compact ? "1rem" : "1.25rem", borderRadius:0, marginBottom: compact ? 0 : "1.5rem" }}>
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
  );
}

function AddonImportBox({ onCharsLoaded }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  const [isErr, setIsErr] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const TRACK_CODES = { v:"Veteran", c:"Champion", h:"Hero", m:"Myth" };
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
        registerCharacterSave(clsId, specId, charLabel, mode || 'scan');
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
    const validKeys = new Set(
      Object.values(CLASS_SPEC_MAP[className]).map(specId => `bis-${clsId}-${specId}-${charLabel}`)
    );
    try {
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) allKeys.push(localStorage.key(i));
      allKeys.forEach(k => {
        if (!k || !k.startsWith("bis-") || !k.endsWith(`-${charLabel}`)) return;
        if (!validKeys.has(k) && k !== `bis-${clsId}-`) {
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
    <div id="addon-sync" style={{ background:"var(--panel)", border:"1px solid rgba(201,146,42,.4)", padding:"1.25rem", marginBottom:"1.5rem" }}>
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
  const [savedChars, setSavedChars] = useState(() => getSavedCharacters());
  const [cardMode, setCardMode] = useState({});
  const roles = ["All", "Tank", "Healer", "DPS"];
  const filtered = CLASSES.filter(c => roleFilter === "All" || c.roles.includes(roleFilter));
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

      <div style={{ height:"1.75rem" }} />
      {savedChars.length > 0 && (() => {
        const groups = {};
        savedChars.forEach(entry => {
          const base = splitSaveLabel(entry.charName).base;
          if (!groups[base]) groups[base] = { base, specs: {} };
          const specKey = `${entry.cls.id}||${entry.spec.id}`;
          if (!groups[base].specs[specKey]) groups[base].specs[specKey] = { cls: entry.cls, spec: entry.spec, saves: {} };
          groups[base].specs[specKey].saves[entry.mode] = entry;
        });
        return (
          <div style={{ marginBottom:"1.5rem" }}>
            <div className="sh">Your Characters</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:".75rem" }}>
              {Object.values(groups).map(({ base, specs }) => (
                <div key={base} style={{ background:"var(--panel)", border:`1px solid var(--bdr2)`, padding:".85rem 1rem" }}>
                  <div style={{ fontFamily:"Cinzel,serif", fontSize:".92rem", color:"var(--gold-lt)", fontWeight:600, marginBottom:".65rem" }}>{base === "default" ? "Unnamed Character" : base}</div>
                  <div style={{ display:"grid", gap:".65rem" }}>
                    {Object.values(specs).sort((a,b) => a.cls.name.localeCompare(b.cls.name) || a.spec.name.localeCompare(b.spec.name)).map(({ cls, spec, saves }) => {
                      const rowKey = `${base}||${cls.id}||${spec.id}`;
                      const saveOrder = ["community","custom","simc","scan"].filter(k => saves[k]);
                      const defaultMode = saveOrder.includes("community") ? "community" : saveOrder[0];
                      const activeMode = cardMode[rowKey] || defaultMode;
                      const active = saves[activeMode] || saves[defaultMode];
                      const totalAcq = active?.acquired || 0;
                      const totalSlots = active?.slotCount || 0;
                      const pct = totalSlots ? Math.round(totalAcq / totalSlots * 100) : 0;
                      return (
                        <div key={rowKey} style={{ border:`1px solid ${cls.color}44`, padding:".55rem .6rem", background:"rgba(255,255,255,.01)" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".35rem", flexWrap:"wrap" }}>
                            <button onClick={() => onLoadCharacter(cls, spec, base, activeMode)} style={{ display:"flex", alignItems:"center", gap:".35rem", background:"var(--bg2)", border:`1px solid ${cls.color}55`, padding:".22rem .5rem", cursor:"pointer", fontSize:".76rem", color:"var(--parch-dk)", fontFamily:"Cinzel,serif" }}>
                              <SpecIcon spec={spec} size={18} /><span style={{ color:cls.color }}>{spec.name}</span><span style={{ opacity:.85 }}>{pct}%</span>
                            </button>
                            <div style={{ fontSize:".68rem", color:"var(--parch-dk)" }}>{cls.name}</div>
                            <select value={activeMode} onChange={e => setCardMode(prev => ({ ...prev, [rowKey]: e.target.value }))} style={{ marginLeft:"auto", background:"var(--bg2)", border:"1px solid var(--bdr2)", color:"var(--parch)", padding:".18rem .45rem", fontFamily:"Cinzel,serif", fontSize:".66rem" }}>
                              {saveOrder.map(mode => <option key={mode} value={mode}>{modeNice(mode)}</option>)}
                            </select>
                            <button onClick={() => {
                              const target = saves[activeMode];
                              if (!target) return;
                              if (!window.confirm(`Delete ${modeNice(activeMode)} save for ${base} ${spec.name}?`)) return;
                              localStorage.removeItem(target.key);
                              unregisterCharacterSave(cls.id, spec.id, base, activeMode);
                              handleDelete();
                            }} style={{ background:"transparent", border:"none", color:"var(--parch-dk)", cursor:"pointer", fontSize:"1rem", lineHeight:1, padding:".1rem .25rem" }} title="Delete active save">×</button>
                          </div>
                          <div style={{ display:"flex", gap:".35rem", flexWrap:"wrap", marginBottom:".45rem" }}>
                            {saveOrder.map(mode => (
                              <button key={mode} onClick={() => { setCardMode(prev => ({ ...prev, [rowKey]: mode })); onLoadCharacter(cls, spec, base, mode); }} style={{ background: activeMode === mode ? cls.color : "transparent", color: activeMode === mode ? "#120700" : "var(--parch-dk)", border:`1px solid ${activeMode === mode ? cls.color : "var(--bdr2)"}`, padding:".16rem .42rem", fontFamily:"Cinzel,serif", fontSize:".62rem", cursor:"pointer" }}>{modeNice(mode)}</button>
                            ))}
                          </div>
                          <div style={{ background:"var(--bdr)", height:"3px", position:"relative" }}><div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:cls.color }} /></div>
                          <div style={{ fontSize:".7rem", color:"var(--parch-dk)", marginTop:".25rem" }}>{totalAcq}/{totalSlots} total · {pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <AddonImportBox onCharsLoaded={() => setSavedChars(getSavedCharacters())} />
      <WeeklyResetPanel />
      <div className="sh" id="group-planner">Group Farm Planner</div>
      <GroupPlanner />

      <div style={{ marginTop:"2.5rem" }} />
      <div id="vs-addon" className="sh">Website vs In-Game Addon</div>
      <p style={{ fontSize:".9rem", color:"var(--parch-dk)", marginBottom:"1.5rem", lineHeight:1.7 }}>
        Both tools are free. Use either independently, or together — export from the addon to sync your progress to the website.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem", marginBottom:"1rem" }}>

        
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
  const [openMode, setOpenMode] = useState("");
  const goHome  = () => { setPage("home"); setCls(null); setSpec(null); setCharName("default"); setOpenMode(""); };
  const goClass = c  => { setCls(c); setPage("spec"); };
  const goTrack = (sp, cn, mode = "") => { const normalized = splitSaveLabel(cn || "default").base || "default"; setSpec(sp); setCharName(normalized); setOpenMode(mode || ""); setPage("tracker"); };

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
                  { icon:"🗺", line1:"Plan your", line2:"farm", sub:"Farm Priority · Raid vs Dungeon", scrollId:"group-planner" },
                  { icon:"👥", line1:"Group", line2:"planning", sub:"Share farm lists · See who needs what", scrollId:"group-planner" },
                  { icon:"✏️", line1:"Build your", line2:"own list", sub:"Up to 3 options per slot", scrollId:"select-class" },
                  { icon:"🎮", line1:"Track", line2:"in-game", sub:"Free addon · Mini overlay", scrollId:"addon-sync" },
                  { icon:"🗓", line1:"Weekly reset", line2:"& Vault", sub:"Reset timer · Vault highlight", scrollId:"weekly-reset" },
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
          {page === "home"    && <Home onSelectClass={goClass} onLoadCharacter={(cls, spec, cn, mode) => { setCls(cls); goTrack(spec, cn, mode); }} />}
          {page === "spec"    && cls  && <SpecPage cls={cls} onBack={goHome} onGo={goTrack} />}
          {page === "tracker" && cls  && spec && (
            <Tracker key={`${cls.id}-${spec.id}-${charName}-${openMode || "default"}`} cls={cls} spec={spec} charName={charName} initialMode={openMode} onBack={() => setPage("spec")} />
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