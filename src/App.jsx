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

const SPEC_ICON_OVERRIDES = {
  "elemental": "data:image/png;base64,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",
  "enhancement": "data:image/png;base64,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",
  "restoration-sham": "data:image/png;base64,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",
  "affliction": "data:image/png;base64,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",
  "demonology": "data:image/png;base64,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",
  "destruction": "data:image/png;base64,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",
  "assassination": "data:image/png;base64,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",
  "outlaw": "data:image/png;base64,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",
  "subtlety": "data:image/png;base64,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",
};

function SpecIcon({ spec, size = 18 }) {
  const iconSrc = SPEC_ICON_OVERRIDES[spec?.id] || (spec?.icon ? `${WOW_ICON_BASE}${spec.icon}.jpg` : null);
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
        borderRadius: "4px",
        objectFit: "cover",
        boxShadow: "0 0 0 1px rgba(0,0,0,.45)",
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
      {id:"devourer",  name:"Devourer",  role:"DPS", icon:"classicon_demonhunter_void",
       note:"New in Midnight — void-powered mid-range spellcaster, Intellect-based."},
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
      {id:"subtlety",      name:"Subtlety",       role:"DPS", icon:"ability_rogue_shadowdance"},
    ],
  },
  {
    id:"shaman", name:"Shaman", color:"#0070DD",
    roles:["DPS","Healer"], armor:"Mail",
    weapons:["2H Weapon","Main Hand + Off Hand"],
    specs:[
      {id:"elemental",        name:"Elemental",   role:"DPS", icon:"spell_shaman_improvedstormstrike"},
      {id:"enhancement",      name:"Enhancement", role:"DPS",  icon:"ability_shaman_stormstrike"},
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
      {id:"destruction", name:"Destruction", role:"DPS", icon:"spell_fire_twilightrainoffire"},
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
            <span className="si"><SpecIcon spec={s} size={34} /></span>
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