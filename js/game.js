var Game = function (scope, difficulty) {
  this.Init(scope, difficulty);
};

Game.prototype.Init = function(scope, difficulty) {
  this.scope = scope;

  this.LOCKED = LOCKED;
  this.AVAILABLE = AVAILABLE;
  this.UNAVAILABLE = UNAVAILABLE;
  this.PURCHASED = PURCHASED
  this.ACTIVE = ACTIVE;
  this.COOLDOWN = COOLDOWN;
  this.DIFFICULTIES = DIFFICULTIES;

  this.difficulty = difficulty;
  this.fps = 18;
  this.stepSize = 1 / this.fps;
  this.steps = 0;
  this.timePlayed = 0;
  this.stepStart;
  this.stepEnd = new Date();

  this.won = false;
  this.level = 1;

  this.gold = STARTING_GOLD;

  this.experience = 0;
  this.experienceNeeded = EXPERIENCE_NEEDED;

  this.meeps = 0;
  this.meepDamage = MEEPS_DAMAGE[difficulty];

  this.chimes = 0;
  this.chimesRate = 0;
  this.chimesPerClick = 0;
  this.chimesPerMeep = CHIMES_PER_MEEP;
  this.chimesPerMeepFloor = CHIMES_PER_MEEP;
  this.chimesExperience = CHIMES_EXPERIENCE[difficulty];
  this.chimesCollected = 0;

  this.damageRate = 0;
  this.damagePerClick = 0;
  this.scaleMonsterLevelHealth = SCALE_MONSTER_LEVEL_HEALTH[difficulty];

  this.defenseStat = 1;
  this.movespeedStat = 0;
  this.damageStat = 5;
  this.attackrateStat = 0;
  this.income = 0;

  this.favorBonus = 0;
  this.spoilsOfWarBonus = 0;
  this.spoilsOfWarActive = 0;
  this.tributeBonus = 0;

  this.smiteBonus = 0;
  this.ghostBonus = 1.0;
  this.flashBonus = .03;
  this.exhaustBonus = 1.0;
  this.igniteDamage = 0;
  this.igniteDamageRate = 0;

  this.items = this.createItems();
  this.spells = this.createSpells();
  this.upgrades = this.createUpgrades();
  this.monstersAvailable = [];
  this.monsters = this.createMonsters();

  this.load();

  this.unlockItems();
  this.unlockSpells();
  this.unlockUpgrades();
  this.unlockMonsters(false);
  this.updateStats();
};

Game.prototype.createItems = function() {
  var items = {};

  items[RELIC_SHIELD] = new Item(this, 250, 1,      2, 0, 0, 0, 1);
  items[ANCIENT_COIN] = new Item(this, 250, 1,      0, 0, 0, 0, 5);
  items[SPELLTHIEFS_EDGE] = new Item(this, 250, 1,  0, 0, 10, 0, 3);
  items[BOOTS_OF_SPEED] = new Item(this, 750, 2,    0, 1, 0, 0, 0);
  items[RUBY_CRYSTAL] = new Item(this, 750, 2,      10, 0, 0, 0, 0);
  items[AMPLIFYING_TOME] = new Item(this, 3000, 3,  0, 0, 50, 0, 0);
  items[DAGGER] = new Item(this, 3000, 3,           0, 0, 0, 1, 0);

  return items;
};

Game.prototype.createUpgrades = function() {
  var upgrades = {};

  // Boots of Speed
  upgrades[BOOTS_OF_SWIFTNESS] = new Upgrade(this, BOOTS_OF_SPEED,        9000, 4, 0, 2, 0, 0, 0, []);
  upgrades[BOOTS_OF_MOBILITY] = new Upgrade(this, BOOTS_OF_SPEED,         180000, 6, 0, 4, 0, 0, 0, [BOOTS_OF_SWIFTNESS]);
  upgrades[IONIAN_BOOTS_OF_LUCIDITY] = new Upgrade(this, BOOTS_OF_SPEED,  25000000, 9, 0, 8, 0, 5, 0, [BOOTS_OF_MOBILITY]);
  upgrades[MERCURYS_TREADS] = new Upgrade(this, BOOTS_OF_SPEED,           2500000000, 12, 50, 10, 0, 0, 0, [IONIAN_BOOTS_OF_LUCIDITY]);
  upgrades[SORCERERS_SHOES] = new Upgrade(this, BOOTS_OF_SPEED,           400000000000, 15, 0, 25, 100, 0, 0, [MERCURYS_TREADS]);

  // Ancient Coin
  upgrades[NOMADS_MEDALLION] = new Upgrade(this, ANCIENT_COIN,            70000, 5, 0, 2, 0, 0, 25, []);
  upgrades[TALISMAN_OF_ASCENSION] = new Upgrade(this, ANCIENT_COIN,       7000000, 8, 0, 3, 0, 2, 170, [NOMADS_MEDALLION]);

  // Spellthief's Edge
  upgrades[FROSTFANG] = new Upgrade(this, SPELLTHIEFS_EDGE,               50000, 5, 0, 0, 20, 0, 12, []);
  upgrades[FROST_QUEENS_CLAIM] = new Upgrade(this, SPELLTHIEFS_EDGE,      5000000, 8, 0, 0, 70, 2, 85, [FROSTFANG]);

  // Relic Shield
  upgrades[TARGONS_BRACE] = new Upgrade(this, RELIC_SHIELD,               50000, 5, 7, 0, 0, 0, 9, []);
  upgrades[FACE_OF_THE_MOUNTAIN] = new Upgrade(this, RELIC_SHIELD,        5000000, 8, 16, 0, 0, 2, 90, [TARGONS_BRACE]);

  // Ruby Crystal
  upgrades[KINDLEGEM] = new Upgrade(this, RUBY_CRYSTAL,                   90000, 5, 10, 0, 0, 1, 0, []);
  upgrades[CRYSTALLINE_BRACER] = new Upgrade(this, RUBY_CRYSTAL,          1000000, 7, 20, 0, 0, 0, 0, []);
  upgrades[GIANTS_BELT] = new Upgrade(this, RUBY_CRYSTAL,                 35000000, 9, 40, 0, 0, 0, 0, []);
  upgrades[WARMOGS_ARMOR] = new Upgrade(this, RUBY_CRYSTAL,               750000000, 11, 70, 0, 0, 0, 0, [GIANTS_BELT]);
  upgrades[RIGHTEOUS_GLORY] = new Upgrade(this, RUBY_CRYSTAL,             18000000000, 13, 70, 5, 0, 0, 0, [CRYSTALLINE_BRACER]);
  upgrades[LOCKET_OF_THE_IRON_SOLARI] = new Upgrade(this, RUBY_CRYSTAL,   600000000000, 15, 120, 0, 0, 4, 0, [KINDLEGEM]);
  upgrades[FROZEN_MALLET] = new Upgrade(this, RUBY_CRYSTAL,               15000000000000, 17, 160, 0, 100, 0, 0, [GIANTS_BELT]);

  // Amplifying Tome
  upgrades[FIENDISH_CODEX] = new Upgrade(this, AMPLIFYING_TOME,           300000, 6, 0, 0, 50, 1, 0, []);
  upgrades[AETHER_WISP] = new Upgrade(this, AMPLIFYING_TOME,              8000000, 8, 0, 2, 100, 0, 0, []);
  upgrades[NEEDLESSLY_LARGE_ROD] = new Upgrade(this, AMPLIFYING_TOME,     150000000, 10, 0, 0, 200, 0, 0, []);
  upgrades[MORELLONOMICON] = new Upgrade(this, AMPLIFYING_TOME,           4000000000, 12, 0, 0, 200, 4, 0, [FIENDISH_CODEX]);
  upgrades[LUDENS_ECHO] = new Upgrade(this, AMPLIFYING_TOME,              75000000000, 14, 0, 3, 250, 0, 0, [NEEDLESSLY_LARGE_ROD]);
  upgrades[ZHONYAS_HOURGLASS] = new Upgrade(this, AMPLIFYING_TOME,        2000000000000, 16, 50, 0, 350, 0, 0, [NEEDLESSLY_LARGE_ROD]);
  upgrades[RABADONS_DEATHCAP] = new Upgrade(this, AMPLIFYING_TOME,        40000000000000, 18, 0, 0, 800, 0, 0, [NEEDLESSLY_LARGE_ROD]);

  // Dagger
  upgrades[RECURVE_BOW] = new Upgrade(this, DAGGER,                       350000, 6, 0, 0, 0, 2, 0, []);
  upgrades[RUNAANS_HURRICANE] = new Upgrade(this, DAGGER,                 9000000, 8, 0, 0, 20, 3, 0, [RECURVE_BOW]);
  upgrades[ZEAL] = new Upgrade(this, DAGGER,                              450000000, 10, 0, 3, 0, 4, 0, []);
  upgrades[WITS_END] = new Upgrade(this, DAGGER,                          9000000000, 12, 50, 0, 50, 5, 0, [RECURVE_BOW]);
  upgrades[STATIKK_SHIV] = new Upgrade(this, DAGGER,                      150000000000, 14, 0, 3, 80, 5, 0, [ZEAL]);
  upgrades[PHANTOM_DANCER] = new Upgrade(this, DAGGER,                    4500000000000, 16, 0, 4, 0, 10, 0, [ZEAL]);
  upgrades[TRINITY_FORCE] = new Upgrade(this, DAGGER,                     100000000000000, 18, 100, 5, 150, 20, 0, [ZEAL]);

  return upgrades;
};

Game.prototype.createSpells = function() {
    var spells = {};

    // game, duration, cooldown, start, end, unlock, tooltip
    spells[GHOST] = new Spell(this, 10, 90, SPELL_ACTIVE, MONSTER_ALL,
      function(game) {game.ghostBonus = 2.0;},
      function(game) {game.ghostBonus = 1.0;},
      function(game) {return game.level >= 4},
      function(game) {return game.spells[GHOST].status == game.LOCKED ? "":
      "+100% chime gathering for 10 seconds.  </br></br>90 second cooldown. <b>(Q)</b>"}
    );

    spells[FLASH] = new Spell(this, 0, 120, SPELL_ACTIVE, MONSTER_ALL,
      function(game) {game.addMeeps(Math.ceil(game.meeps * game.flashBonus));
                      showRing(FLASH, RING_DURATION)},
      function(game) {},
      function(game) {return game.level >= 6},
      function(game) {return game.spells[FLASH].status == game.LOCKED ? "":
      "+3% total meeps.</br>(<b>" + game.prettyIntCompact(Math.ceil(game.meeps * game.flashBonus)) + "</b>)</br></br>120 second cooldown. <b>(W)</b>"}
    );

    spells[SMITE] = new Spell(this, 0, 60, SPELL_ACTIVE, MONSTER_JUNGLE,
      function(game) {game.smiteBonus = .20;
                      game.addDamage(game.getSmiteDamage(), true);
                      game.smiteBonus = 0;
                      showRing(SMITE, RING_DURATION)},
      function(game) {},
      function(game) {return game.level >= 2},
      function(game) {return game.spells[SMITE].status == game.LOCKED ? "":
      "Deal <b>" + game.prettyIntCompact(game.getSmiteDamage()) + "</b> damage instantly.  Damage scales with level and experience.</br></br>Kills with smite grant +20% gold.  Does not work against champions.  </br></br>60 second cooldown. <b>(E)</b>"}
      );


    spells[IGNITE] = new Spell(this, 5, 120, SPELL_ACTIVE, MONSTER_CHAMPION,
      function(game) {game.igniteDamageRate = game.igniteDamage / 5;},
      function(game) {game.igniteDamageRate = 0},
      function(game) {return game.level >= 16},
      function(game) {return game.spells[IGNITE].status == game.LOCKED ? "":
      "Deal <b>" + game.prettyIntCompact(game.igniteDamage) + "</b> damage over 5 seconds.  Damage scales with level.  Only works against champions.  </br></br>120 second cooldown. <b>(R)</b>"}
    );

    spells[EXHAUST] = new Spell(this, 10, 90, SPELL_ACTIVE, MONSTER_CHAMPION,
      function(game) {game.exhaustBonus = 2.0;},
      function(game) {game.exhaustBonus = 1.0},
      function(game) {return game.level >= 17},
      function(game) {return game.spells[EXHAUST].status == game.LOCKED ? "":
      "+100% damage dealt for 10 seconds.  Only works against champions.  </br></br>90 second cooldown. <b>(T)</b>"}
    );

    spells[TELEPORT] = new Spell(this, 0, 300, SPELL_ACTIVE, MONSTER_ALL,
      function(game) {},
      function(game) {var cooldownSpells = game.getObjectsByStatus(game.spells, game.COOLDOWN);
                      var len = cooldownSpells.length;
                      for (var i = 0; i < len; i++) {
                        var spell = game.spells[cooldownSpells[i]];
                        spell.cooldownLeft = 0;
                        spell.status = game.AVAILABLE;
                      }
                      var activeSpells = game.getObjectsByStatus(game.spells, game.ACTIVE);
                      len = activeSpells.length;
                      for (var i = 0; i < len; i++) {
                        var spell = game.spells[activeSpells[i]];
                        spell.durationLeft = spell.duration;
                      }
                     },
      function(game) {return game.level >= 13},
      function(game) {return game.spells[TELEPORT].status == game.LOCKED ? "":
      "Reset cooldowns of all spells.  </br></br>300 second cooldown. <b>(Y)</b>"}
    );

    spells[SPOILS_OF_WAR] = new Spell(this, 0, 45, SPELL_PASSIVE, MONSTER_JUNGLE,
      function(game) {game.spoilsOfWarActive = 1;
                      game.killMonster();
                      game.spoilsOfWarActive = 0;
                      showRing(SPOILS_OF_WAR, RING_DURATION)},
      function(game) {},
      function(game) {return game.upgrades[FACE_OF_THE_MOUNTAIN].status == game.PURCHASED;},
      function(game) {return game.spells[SPOILS_OF_WAR].status == game.LOCKED ? "":
      "Execute monsters below 25% max health on click, gaining <b>+" + (game.spoilsOfWarBonus * 100).toFixed(1) + "%</b> reward gold.  Gold scales with Relic Shields owned.  Does not work against champions. </br></br>45 second cooldown."}
    );

    spells[FAVOR] = new Spell(this, 0, 0, SPELL_PASSIVE, MONSTER_ALL,
      function(game) {},
      function(game) {},
      function(game) {return game.upgrades[TALISMAN_OF_ASCENSION].status == game.PURCHASED;},
      function(game) {return game.spells[FAVOR].status == game.LOCKED ? "":
      "Passively gain <b>+" + (game.favorBonus * 100).toFixed(1) + "%</b> gold from monsters killed.  Gold scales with Ancient Coins owned. </br></br>No cooldown."}
    );

    spells[TRIBUTE] = new Spell(this, 0, 30, SPELL_PASSIVE, MONSTER_ALL,
      function(game) {var monster = game.monsters[game.monster];
                      var gold = Math.ceil(monster.gold * game.tributeBonus);
                      gold /= game.monster == TEEMO ? 15 : 1;
                      game.gold += gold;
                      game.progress.spells[TRIBUTE].goldGained += gold;
                      if (monster.type == MONSTER_CHAMPION) {
                        game.addDamage(game.damageStat * game.attackrateStat * game.exhaustBonus * 5);
                      }
                      showRing(TRIBUTE, RING_DURATION)},
      function(game) {},
      function(game) {return game.upgrades[FROST_QUEENS_CLAIM].status == game.PURCHASED;},
      function(game) {return game.spells[TRIBUTE].status == game.LOCKED ? "":
      "Gain <b>" + (game.tributeBonus * 100).toFixed(1) + "%</b> of reward gold on next monster click.  Gold scales with Spellthief's Edges owned.</br></br>Deals <b>" + game.prettyIntCompact(game.damageStat * game.attackrateStat * game.exhaustBonus * 5, 1) + "</b> bonus damage to champions (scales with DPS).</br></br>30 second cooldown."}
    );

    return spells;
}

Game.prototype.createMonsters = function() {
  var monsters = {};
  var monster;
  var scaleHealth;
  var scaleExp;
  var scaleReward;
  var type;
  var i;
  var len = MONSTERS.length;
  for (i = 0; i < len; i++) {
    monster = MONSTERS[i];
    scaleHealth = Math.pow(this.scaleMonsterLevelHealth, i);
    scaleExp = Math.pow(SCALE_MONSTER_LEVEL_REWARD, i);
    scaleReward = Math.pow(SCALE_MONSTER_LEVEL_REWARD, i);
    if (i == len - 1) {
      var health = MONSTER_HEALTH * scaleHealth * 15;
      var healthPower = Math.floor(getBaseLog(10, health));
      var newHealth = Math.pow(10, healthPower) * 1.11111.toFixed(2 + healthPower % 3);
      newHealth = Math.ceil(health / newHealth) * newHealth;

      scaleHealth =  newHealth / MONSTER_HEALTH;
      scaleExp = 999990000000000000 / MONSTER_EXPERIENCE;
      scaleReward = 999990000000000 / MONSTER_REWARD;
    }

    type = CHAMPIONS.indexOf(monster) > -1 ? MONSTER_CHAMPION : MONSTER_JUNGLE;
    monsters[monster] = new Monster(this, i + 1, MONSTER_HEALTH * scaleHealth,
                                                 MONSTER_EXPERIENCE * scaleExp + 10 * (i + 1),
                                                 MONSTER_REWARD * scaleReward + 10 * (i + 1),
                                                 type);
  }
  return monsters;
};

Game.prototype.start = function() {
  var thisref = this;
  this.step();
  // window.setInterval(function() {
  //   thisRef.scope.$apply(function(scope) {
  //     thisRef.step(thisRef.stepSize);
  //   });
  // }, thisRef.stepSize * 1000);

  window.setInterval(function() {
    updateTooltips();
  }, 200);

  window.setInterval(function() {
    thisref.save();
  }, 20000);
};


// Increment functions
Game.prototype.step = function(step) {
  this.stepStart = new Date();
  var elapsedTime  = (this.stepStart - this.stepEnd) / 1000;

  var thisref = this;
  this.scope.$apply(function(scope) {
    thisref.addChimes(thisref.chimesRate * elapsedTime);
    thisref.addDamage(thisref.damageRate * elapsedTime);
    thisref.addGold(thisref.income * elapsedTime);
    thisref.addSpellTime(elapsedTime);

    thisref.timePlayed += elapsedTime;
    thisref.progress.general.timePlayed += elapsedTime;
  });

  this.stepEnd = this.stepStart;

  window.setTimeout(function() {
    thisref.step();
  }, thisref.stepSize * 1000)
};

Game.prototype.addChimes = function(chimes) {
  this.chimes += chimes;
  if (this.level < 19)
    this.addExperience(this.chimesExperience * chimes);
  while (this.chimes >= this.chimesPerMeepFloor) {
    this.chimes -= this.chimesPerMeepFloor;
    this.addMeeps(1);
  }
  this.chimesCollected += chimes;
  this.progress.general.totalChimes += chimes;
};

Game.prototype.addDamage = function(damage, user) {
  var monster = this.monsters[this.monster];
  var executeThreshold = .25 * monster.maxHealth;
  var currentHealth = monster.currentHealth;
  if (user && this.spells[SPOILS_OF_WAR].status == this.AVAILABLE && currentHealth - damage <= executeThreshold) {
    if (currentHealth > executeThreshold)
      damage -= currentHealth - executeThreshold;
    this.activateSpell(SPOILS_OF_WAR);
  }

  while (damage >= this.monsters[this.monster].currentHealth) {
    damage -= this.monsters[this.monster].currentHealth;
    this.killMonster();
  }
  monster.currentHealth -= damage;
  this.progress.general.totalDamage += damage;
};

Game.prototype.addGold = function(gold) {
  this.gold += gold;
  this.progress.general.goldEarned += gold;
};

Game.prototype.addExperience = function(experience) {
  this.experience += experience;
  this.progress.general.experienceEarned += experience;
  while (this.experience >= this.experienceNeeded && this.level < 19) {
    this.experience -= this.experienceNeeded;
    this.levelUp();
  }
};

Game.prototype.addMeeps = function(meeps) {
  meeps = meeps || 1;


  var oldMeeps = this.meeps || 1;
  var newMeeps = this.meeps + meeps;

  if (newMeeps - oldMeeps < 10) {
    this.chimesPerMeep += Math.log(getFactorialRange(newMeeps, oldMeeps)) / Math.log(2);
  }
  else {
    this.chimesPerMeep += stirlingApproximation(newMeeps) / Math.log(2) - stirlingApproximation(oldMeeps) / Math.log(2);
  }
  this.chimesPerMeepFloor = Math.floor(this.chimesPerMeep);

  this.meeps = newMeeps;
  this.damageStat += meeps * this.meepDamage;
  this.progress.general.totalMeeps += meeps;

  this.updateStats();
};

Game.prototype.addSpellTime = function(time) {
  var activeSpells = this.getObjectsByStatus(this.spells, this.ACTIVE);
  var cooldownSpells = this.getObjectsByStatus(this.spells, this.COOLDOWN);
  var unavailableSpells = this.getObjectsByStatus(this.spells, this.UNAVAILABLE);
  var len = activeSpells.length;
  for (var i = 0; i < len; i++) {
    var activeSpell = this.spells[activeSpells[i]];
    activeSpell.durationLeft -= time;
    if (activeSpell.durationLeft <= -.2) {
      activeSpell.end(this);
      activeSpell.status = this.COOLDOWN;
      activeSpell.cooldownLeft = activeSpell.cooldown;
      this.updateStats();
    }
  }
  len = cooldownSpells.length;
  for (var i = 0; i < len; i++) {
    var cooldownSpell = this.spells[cooldownSpells[i]];
    cooldownSpell.cooldownLeft -= time;
    if (cooldownSpell.cooldownLeft <= 0) {

      // after coming off cooldown, check if spell should be available or not
      var monster = this.monsters[this.monster];
      if (monster && cooldownSpell.target != MONSTER_ALL && cooldownSpell.target != monster.type)
        cooldownSpell.status = this.UNAVAILABLE;
      else
        cooldownSpell.status = this.AVAILABLE;
    }
  }

  // if unavailable but with duration remaining, end spell and put on cooldown.
  len = unavailableSpells.length;
  for (var i = 0; i < len; i++) {
    var unavailableSpell = this.spells[unavailableSpells[i]];
    if (unavailableSpell.durationLeft > 0) {
      unavailableSpell.end(this);
      unavailableSpell.status = this.COOLDOWN;
      unavailableSpell.cooldownLeft = unavailableSpell.cooldown;
      this.updateStats();
    }
  }
};

// Update Functions
Game.prototype.updateStats = function() {
  this.chimesRate = this.defenseStat * this.movespeedStat * this.ghostBonus;
  // chimes collected equals base defenseStat + 2% of current cps
  this.chimesPerClick = this.defenseStat * this.ghostBonus + .04 * this.chimesRate;

  this.damageRate = this.damageStat * this.attackrateStat * this.exhaustBonus + this.igniteDamageRate;
  // damage dealt equals base damageStat + 2% of current dps
  this.damagePerClick = this.exhaustBonus * this.damageStat + .04 * this.damageRate;
};

Game.prototype.unlockItems = function() {
  var items = this.getObjectsByStatus(this.items, this.LOCKED);
  var len = items.length;
  for (var i = 0; i < len; i++) {
    var item = this.items[items[i]];
    if (item.unlock(this)) {
      item.status = this.AVAILABLE;
    }
  }
};

Game.prototype.unlockUpgrades = function() {
  var upgrades = this.getObjectsByStatus(this.upgrades, this.LOCKED);
  var len = upgrades.length;
  for (var i = 0; i < len; i++) {
    var upgrade = this.upgrades[upgrades[i]];
    var item = this.items[upgrade.item];
    if (upgrade.unlock(this)) {
      upgrade.status = this.AVAILABLE;
      item.upgradesAvailable.push(upgrades[i]);
    }
  }
};

Game.prototype.unlockSpells = function() {
  var spells = this.getObjectsByStatus(this.spells, this.LOCKED);
  var len = spells.length;
  for (var i = 0; i < len; i++) {
    var spell = this.spells[spells[i]];
    if (spell.unlock(this)) {
      spell.status = this.AVAILABLE;
    }
  }

  // disable spells when on wrong monster type
  spells = this.getObjectsByStatus(this.spells, this.AVAILABLE).concat(this.getObjectsByStatus(this.spells, this.ACTIVE));
  len = spells.length;
  for (var i = 0; i < len; i++) {
    var spell = this.spells[spells[i]];
    var monster = this.monsters[this.monster];
    if (monster && spell.target != MONSTER_ALL && spell.target != monster.type) {
      spell.status = this.UNAVAILABLE;
    }
  }

  // enables spells when on correct monster type
  spells = this.getObjectsByStatus(this.spells, this.UNAVAILABLE);
  len = spells.length;
  for (var i = 0; i < len; i++) {
    var spell = this.spells[spells[i]];
    var monster = this.monsters[this.monster];
    if (!monster || spell.target == MONSTER_ALL || spell.target == monster.type) {
      spell.status = this.AVAILABLE;
    }
  }

};

// TODO: do this without setMonster
Game.prototype.unlockMonsters = function(setMonster) {
  for (var monsterName in this.monsters) {
    if (this.monsters.hasOwnProperty(monsterName)) {
      var monster = this.monsters[monsterName];
      if (setMonster && monster.status == this.ACTIVE) {
        monster.experience /= 5;
        monster.status = this.AVAILABLE;
      }
      if (this.level >= monster.level && this.monstersAvailable.indexOf(monsterName) < 0) {
        this.monstersAvailable.push(monsterName);
        if (!this.monster || setMonster) {
          this.monster = monsterName;
          monster.status = this.ACTIVE;
        }
      }
    }
  }
};

// Action Functions
Game.prototype.chimesClick = function() {
  this.addChimes(this.chimesPerClick);
  this.progress.general.clickChimes += this.chimesPerClick;
  this.progress.general.totalClicks++;
  this.progress.general.chimeClicks++;
};

Game.prototype.damageClick = function() {
  if (this.spells[TRIBUTE].status == this.AVAILABLE)
    this.activateSpell(TRIBUTE);

  this.addDamage(this.damagePerClick, true);
  this.progress.general.clickDamage += this.damagePerClick;
  this.progress.general.totalClicks++;
  this.progress.general.damageClicks++;
};

Game.prototype.spellClick = function(name) {
  var spell = this.spells[name];
  if (spell.type == SPELL_PASSIVE)
    return;
  this.activateSpell(name)
};

Game.prototype.activateSpell = function(name) {
  var spell = this.spells[name];
  if (spell.status != this.AVAILABLE) {
    return;
  }
  spell.start(this);
  spell.durationLeft = spell.duration
  spell.status = this.ACTIVE;

  this.progress.spells[name].count++;

  this.updateStats();
};

Game.prototype.buyItem = function(name, count) {
  count = count ? count : 1;
  var item = this.items[name];
  var bought = 0;
  while (count--) {
    if (this.gold >= item.cost) {
      this.gold -= item.cost;
      this.progress.items[name].goldSpent += item.cost;
      this.progress.general.goldSpent += item.cost;
      item.count++;
      item.cost += item.startCost * SCALE_ITEM_COST * item.count;
      bought++;

    }
    else {
      break;
    }
  }

  this.defenseStat += bought * item.defenseStat;
  this.movespeedStat += bought * item.movespeedStat;
  this.damageStat += bought * item.damageStat;
  this.attackrateStat += bought * item.attackrateStat;
  this.income += bought * item.income;

  item.cost10 = item.calculatePurchaseCost(10);
  item.cost100 = item.calculatePurchaseCost(100);
  item.cost1000 = item.calculatePurchaseCost(1000);

  this.progress.items[name].count += bought;

  if (this.spells[FAVOR].status != this.LOCKED && name == ANCIENT_COIN)
    this.favorBonus = this.getFavorBonus() / 100;
  else if (this.spells[TRIBUTE].status != this.LOCKED && name == SPELLTHIEFS_EDGE)
    this.tributeBonus = this.getTributeBonus() / 100;
  else if (this.spells[SPOILS_OF_WAR].status != this.LOCKED && name == RELIC_SHIELD)
    this.spoilsOfWarBonus = this.getSpoilsOfWarBonus() / 100;

  this.updateStats();
};

Game.prototype.buyUpgrade = function(name) {
  var upgrade = this.upgrades[name];
  if (upgrade.status == this.AVAILABLE && this.gold >= upgrade.cost) {
    this.gold -= upgrade.cost;
    upgrade.status = this.PURCHASED;

    // Upgrade all future items
    var item = this.items[upgrade.item];
    item.defenseStat += upgrade.defenseStat;
    item.movespeedStat += upgrade.movespeedStat;
    item.damageStat += upgrade.damageStat;
    item.attackrateStat += upgrade.attackrateStat;
    item.income += upgrade.income;

    item.upgrades.push(name);
    item.upgradesAvailable.splice(item.upgradesAvailable.indexOf(name), 1);

    // Upgrade all previously bought items
    var count = item.count;
    this.defenseStat += count * upgrade.defenseStat;
    this.movespeedStat += count * upgrade.movespeedStat;
    this.damageStat += count * upgrade.damageStat;
    this.attackrateStat += count * upgrade.attackrateStat;
    this.income += count * upgrade.income;

    this.progress.general.goldSpent += upgrade.cost;

    this.unlockUpgrades();
    this.unlockSpells();

    if (name == TALISMAN_OF_ASCENSION)
      this.favorBonus = this.getFavorBonus() / 100;
    else if (name == FROST_QUEENS_CLAIM)
      this.tributeBonus = this.getTributeBonus() / 100;
    else if (name == FACE_OF_THE_MOUNTAIN)
      this.spoilsOfWarBonus = this.getSpoilsOfWarBonus() / 100;

    this.updateStats();
  }
};

Game.prototype.selectMonster = function(direction) {
  var index = this.monstersAvailable.indexOf(this.monster);
  var length = this.monstersAvailable.length;
  direction == 'left' ? index -= 1 : index += 1;

  if (index == -1 || index == length)
    return;

  this.monster = this.monstersAvailable[index];
  this.unlockSpells();
};

// Threshold functions
Game.prototype.killMonster = function() {
  var monster = this.monsters[this.monster];
  var exp = monster.experience;

  var smiteGold = this.smiteBonus * monster.gold;
  var spoilsGold = this.spoilsOfWarBonus * this.spoilsOfWarActive * monster.gold;
  var favorGold = this.favorBonus * monster.gold;
  var gold = Math.ceil(monster.gold + smiteGold + spoilsGold + favorGold);

  this.progress.spells[SMITE].goldGained += smiteGold;
  this.progress.spells[SPOILS_OF_WAR].goldGained += spoilsGold;
  this.progress.spells[FAVOR].goldGained += favorGold;

  monster.maxHealth += monster.startHealth * SCALE_MONSTER_HEALTH;
  monster.currentHealth = monster.maxHealth;
  monster.count++;

  this.progress.monsters[this.monster].count++;


  this.addGold(gold);

  if (this.monster == TEEMO)
    this.win();
  if (this.level != 19 || this.monster == TEEMO)
    this.addExperience(exp);
};

Game.prototype.levelUp = function(levels) {
  levels = levels || 1;
  while (levels > 0 && this.level < 19 && this.level > 0) {
    this.level += 1;

    this.experienceNeeded *= SCALE_EXPERIENCE_NEEDED;
    this.chimesExperience *= SCALE_CHIMES_EXPERIENCE;

    if (this.level == 19) {
      this.experienceNeeded = 999990000000000000;
      this.experience = 0;
    }
    levels--;
  };
  this.igniteDamage = this.getIgniteDamage();

  this.updateStats();
  this.unlockItems();
  this.unlockUpgrades();
  this.unlockMonsters(true);
  this.unlockSpells();
};

Game.prototype.win = function() {
  if (!this.won) {
    this.won = true;

    var time;
    switch (this.difficulty) {
      case 'easy':
        this.progress.wins.easy.count++;
        time = this.progress.times.easy.count;
        this.progress.times.easy.count = Math.min(this.getTime(), time ? time : Infinity);
        break;
      case 'medium':
        this.progress.wins.medium.count++;
        time = this.progress.times.medium.count;
        this.progress.times.medium.count = Math.min(this.getTime(), time ? time : Infinity);
        break;
      case 'hard':
        this.progress.wins.hard.count++;
        time = this.progress.times.hard.count;
        this.progress.times.hard.count = Math.min(this.getTime(), time ? time : Infinity);
        break;
      case 'marathon':
        this.progress.wins.marathon.count++;
        time = this.progress.times.marathon.count;
        this.progress.times.marathon.count = Math.min(this.getTime(), time ? time : Infinity);
        break;
      case 'impossible':
        this.progress.wins.impossible.count++;
        time = this.progress.times.impossible.count;
        this.progress.times.impossible.count = Math.min(this.getTime(), time ? time : Infinity);
        break;
      default:
    }

    showWinModal();
  }
};

// Utility Functions
Game.prototype.getTime = function() {
  return this.steps / this.fps;
};

Game.prototype.getRoundedTime = function() {
  return Math.floor(this.getTime());
};

Game.prototype.getImageUrl = function(name, folder) {

  if (folder)
    folder += "/";
  else
    folder = "";

  return "images/" + folder + name.split(" ").join("_").split("'").join("").split(".").join("") + ".png";
};

Game.prototype.getItemImageUrl = function(name) {
  return this.getImageUrl(name + '_U', 'items/upscale');
};

Game.prototype.getMonsterImageUrl = function(name) {
  return this.getImageUrl(name, 'monsters/upscale');
};

Game.prototype.getSpellImageUrl = function(name) {
  return this.getImageUrl(name, 'spells');
};

Game.prototype.getLockedImageUrl = function() {
  return this.getImageUrl('locked');
}

Game.prototype.getLevelText = function() {
  return this.level == 19 ? 'T' : this.level;
};

Game.prototype.prettyInt = function(num, fixed) {
  return prettyIntBig(num, fixed);
};

Game.prototype.prettyIntCompact = function(num, fixed) {
  return prettyIntBigCompact(num, fixed);
};

Game.prototype.prettyIntVariable = function(num, fixed, width) {
  width = width || 1200;
  return window.innerWidth > width ? prettyIntBig(num, fixed) : prettyIntBigCompact(num, fixed);
};

Game.prototype.prettyTime = function(seconds) {
  return prettyTime(seconds);
};

Game.prototype.isPlural = function(num, name) {
  return (num == 1 || $.inArray(name, IGNORE_PLURALS) > -1) ? '' : ($.inArray(name, SPECIAL_PLURALS) > -1 ? 'es': 's');
};

Game.prototype.getMeepProgressPercent = function() {
  return 100 * this.chimes / this.chimesPerMeepFloor;
};

Game.prototype.getMonsterHealthPercent = function() {
  var monster = this.monsters[this.monster];
  return 100 * monster.currentHealth / monster.maxHealth;
};

Game.prototype.getExperiencePercent = function() {
  var percent = 100 * this.experience / this.experienceNeeded;
  return percent > 100 ? 100 : percent;
};

Game.prototype.getExperienceText = function() {
  return this.won ? "You Win!" : prettyIntBig(this.experience) + " / " + prettyIntBig(this.experienceNeeded) + " xp";

};

Game.prototype.getSpellTimePercent = function(spellName) {
  var spell = this.spells[spellName];
  if (spell.status == ACTIVE) {
    return 100 - 100 * Math.max(0, spell.durationLeft) / (spell.duration + .15);
  }
  else if (spell.status == COOLDOWN) {
    return 100 * spell.cooldownLeft / spell.cooldown;
  }
  else return 0;
};

Game.prototype.getFavorBonus = function() {
  return 2 + getBaseLog(4, this.items[ANCIENT_COIN].count + 1);
};

Game.prototype.getSpoilsOfWarBonus = function() {
  return getBaseLog(1.5, this.items[RELIC_SHIELD].count + 1);
};

Game.prototype.getTributeBonus = function() {
  return 5 + getBaseLog(2.5, this.items[SPELLTHIEFS_EDGE].count + 1);
};

Game.prototype.getSmiteDamage = function() {
  return 20 * this.level + MONSTER_HEALTH * Math.pow(this.scaleMonsterLevelHealth, this.level - 1) * (.1 + .001 * this.getExperiencePercent());
};

Game.prototype.getIgniteDamage = function() {
  return MONSTER_HEALTH * Math.pow(this.scaleMonsterLevelHealth, this.level - 1) * .3;
};

Game.prototype.isFirstMonster = function() {
  var index = this.monstersAvailable.indexOf(this.monster);
  return index == 0 ? 'first' : '';
};

Game.prototype.isLastMonster = function() {
  var index = this.monstersAvailable.indexOf(this.monster);
  return index == this.monstersAvailable.length - 1 ? 'last' : '';
};

Game.prototype.getObjectsByStatus = function(objectMap, status) {
  var objects = [];
  for (var objectName in objectMap) {
    if (objectMap.hasOwnProperty(objectName)) {
      var object = objectMap[objectName];
      if (isNaN(status) || object.status == status) {
        objects.push(objectName);
      }
    }
  }
  return objects;
};

Game.prototype.getClassName = function(name) {
  var name = name.toLowerCase();
  return name.split(' ')[0];
};

Game.prototype.getStatNameVariable = function(name, width) {
  if (window.innerWidth < width) {
    switch (name) {
      case "Defense":
        return "Def";
      case "Move speed":
        return "MS";
      case "Damage":
        return "Dmg";
      case "Attack rate":
        return "AR";
    }
  }
  return name;
};

Game.prototype.isZero = function(count) {
  return count == 0 ? 'zero' : '';
};

Game.prototype.showNewGameModal = function(reset, difficulty) {
  this.newGameDifficulty = difficulty;
  this.newGameReset = reset;
  return showNewGameModal(reset, difficulty);
};

Game.prototype.save = function() {
  this.saveProgress();
  this.saveGame();
  showSave();
};

Game.prototype.saveProgress = function() {
  localStorage.setItem('progress', JSON.stringify(this.progress));
};

Game.prototype.saveGame = function() {
  var save = {};
  this.saveState(save);
  this.saveItems(save);
  this.saveUpgrades(save);
  this.saveSpells(save);
  this.saveMonsters(save);

  localStorage.setItem('save', JSON.stringify(save));
  localStorage.setItem('difficulty', DIFFICULTIES.indexOf(this.difficulty));
};

Game.prototype.saveState = function(save) {
  var obj = {};

  obj['steps'] = this.steps;
  obj['timePlayed'] = this.timePlayed;
  obj['won'] = this.won;
  obj['level'] = this.level;

  obj['gold'] = this.gold;

  obj['experience'] = this.experience;

  obj['meeps'] = this.meeps;

  obj['chimes'] = this.chimes;
  obj['chimesPerMeep'] = this.chimesPerMeep;
  obj['chimesPerMeepFloor'] = this.chimesPerMeepFloor;
  obj['chimesCollected'] = this.chimesCollected;

  obj['monster'] = this.monster;

  obj['spoilsOfWarActive'] = this.spoilsOfWarActive;
  obj['smiteBonus'] = this.smiteBonus;
  obj['ghostBonus'] = this.ghostBonus;
  obj['exhaustBonus'] = this.exhaustBonus;
  obj['igniteDamageRate'] = this.igniteDamageRate;

  save['state'] = obj;
};

Game.prototype.saveItems = function(save) {
  var items = this.items;
  var obj = {};
  for (var itemName in items) {
    if (items.hasOwnProperty(itemName)) {
      var item = items[itemName];
      var itemData = {};
      itemData['count'] = item.count;
      itemData['upgrades'] = item.upgrades;
      itemData['upgradesAvailable'] = item.upgradesAvailable;
      itemData['cost'] = item.cost;

      obj[itemName] = itemData;
    }
  }

  save['items'] = obj;
};

Game.prototype.saveUpgrades = function(save) {
  var upgrades = this.upgrades;
  var obj = {};
  for (var upgradeName in upgrades) {
    if (upgrades.hasOwnProperty(upgradeName)) {
      var upgrade = upgrades[upgradeName];

      var upgradeData = {};
      upgradeData['status'] = upgrade.status;

      obj[upgradeName] = upgradeData;
    }
  }
  save['upgrades'] = obj;
};

Game.prototype.saveSpells = function(save) {
  var spells = this.spells;
  var obj = {};
  for (var spellName in spells) {
    if (spells.hasOwnProperty(spellName)) {
      var spell = spells[spellName];
      var spellData = {};

      spellData['durationLeft'] = spell.durationLeft
      spellData['cooldownLeft'] = spell.cooldownLeft
      spellData['status'] = spell.status;

      obj[spellName] = spellData;
    }
  }
  save['spells'] = obj;
};

Game.prototype.saveMonsters = function(save) {
  var monsters = this.monsters;
  var obj = {};
  for (var monsterName in monsters) {
    if (monsters.hasOwnProperty(monsterName)) {
      var monster = monsters[monsterName];
      var monsterData = {};
      monsterData['currentHealth'] = monster.currentHealth;
      monsterData['count'] = monster.count;
      monsterData['status'] = monster.status;

      obj[monsterName] = monsterData;
    }
  }
  save['monsters'] = obj;
};

Game.prototype.load = function() {
  this.loadProgress();
  this.loadGame();
};

Game.prototype.loadProgress = function() {
  obj = {};

  obj['general'] = {};
  obj['general']['timePlayed'] = 0;
  obj['general']['experienceEarned'] = 0;

  obj['general']['totalChimes'] = 0;
  obj['general']['clickChimes'] = 0;

  obj['general']['totalDamage'] = 0;
  obj['general']['clickDamage'] = 0;

  obj['general']['totalClicks'] = 0;
  obj['general']['chimeClicks'] = 0;
  obj['general']['damageClicks'] = 0;

  obj['general']['totalMeeps'] = 0;

  obj['general']['goldEarned'] = 0;
  obj['general']['goldSpent'] = 0;

  obj['general']['points'] = 0;
  obj['general']['pointsEarned'] = 0;

  // items purchased
  var order = 0;
  obj['items'] = {};
  for (var item in this.items) {
    obj['items'][item] = {'item': item, 'count': 0, 'goldSpent': 0, 'order': order};
    order++;
  }

  // monsters killed
  order = 0;
  obj['monsters'] = {};
  for (var monster in this.monsters) {
    obj['monsters'][monster] = {'monster': monster, 'count': 0, 'order': order};
    order++;
  }

  // spells used
  order = 0;
  obj['spells'] = {};
  for (var spell in this.spells) {
    obj['spells'][spell] = {'spell': spell, 'count': 0, 'goldGained': 0, 'meepsGained': 0, 'order': order};
    order++;
  }

  obj['wins'] = {};
  obj['wins']['easy'] = {'difficulty': 'easy', 'count': 0, 'order': 0};
  obj['wins']['medium'] = {'difficulty': 'medium', 'count': 0, 'order': 1};
  obj['wins']['hard'] = {'difficulty': 'hard', 'count': 0, 'order': 2};
  obj['wins']['marathon'] = {'difficulty': 'marathon', 'count': 0, 'order': 3};
  obj['wins']['impossible'] = {'difficulty': 'impossible', 'count': 0, 'order': 4};


  obj['times'] = {};
  obj['times']['easy'] = {'difficulty': 'easy', 'count': null, 'order': 0};
  obj['times']['medium'] = {'difficulty': 'medium', 'count': null, 'order': 1};
  obj['times']['hard'] = {'difficulty': 'hard', 'count': null, 'order': 2};
  obj['times']['marathon'] = {'difficulty': 'marathon', 'count': null, 'order': 3};
  obj['times']['impossible'] = {'difficulty': 'impossible', 'count': null, 'order': 4};


  var progress = JSON.parse(localStorage.getItem('progress'));
  this.progress = progress ? $.extend(true, obj, progress) : obj;
};

Game.prototype.loadGame = function() {
  var save = JSON.parse(localStorage.getItem('save'));
  if (save) {
    this.loadState(save['state']);
    this.loadItems(save['items']);
    this.loadUpgrades(save['upgrades']);
    this.loadSpells(save['spells']);
    this.loadMonsters(save['monsters']);
    this.recalculateState();
  }
}

Game.prototype.loadState = function(obj) {
  if (!obj) return;

  this.steps = obj['steps'];
  this.timePlayed = obj['timePlayed'] || this.steps * this.stepSize;
  this.won = obj['won'];
  this.level = obj['level'];

  this.gold = obj['gold'];

  this.experience = obj['experience'];

  this.meeps = obj['meeps'];

  this.chimes = obj['chimes'];
  this.chimesPerMeep = obj['chimesPerMeep'];
  this.chimesPerMeepFloor = obj['chimesPerMeepFloor'];
  this.chimesCollected = obj['chimesCollected'];

  this.monster = obj['monster'];

  this.spoilsOfWarActive = obj['spoilsOfWarActive'];
  this.smiteBonus = obj['smiteBonus'];
  this.ghostBonus = obj['ghostBonus'];
  this.exhaustBonus = obj['exhaustBonus'];
  this.igniteDamageRate = obj['igniteDamageRate'];
};

Game.prototype.loadItems = function(obj) {
  if (!obj) return;

  for (var name in obj) {
    if (obj.hasOwnProperty(name)) {
      var data = obj[name];
      var item = this.items[name];
      if (data && item) {
        item.count = data['count'];
        item.upgrades = data['upgrades'];
        item.upgradesAvailable = data['upgradesAvailable'];
        item.cost = item.startCost + item.startCost * SCALE_ITEM_COST * item.count * (item.count + 1) / 2;
        item.cost10 = item.calculatePurchaseCost(10);
        item.cost100 = item.calculatePurchaseCost(100);
        item.cost1000 = item.calculatePurchaseCost(1000);
      }
    }
  }
};

Game.prototype.loadUpgrades = function(obj) {
  if (!obj) return;

  for (var name in obj) {
    if (obj.hasOwnProperty(name)) {
      var data = obj[name];
      var upgrade = this.upgrades[name];
      if (data && upgrade) {
        upgrade.status = data['status'];

        if (data['status'] == PURCHASED) {
          var item = this.items[upgrade.item];
          item.defenseStat += upgrade.defenseStat;
          item.movespeedStat += upgrade.movespeedStat;
          item.damageStat += upgrade.damageStat;
          item.attackrateStat += upgrade.attackrateStat;
          item.income += upgrade.income;
        }
      }
    }
  }
};

Game.prototype.loadSpells = function(obj) {
  if (!obj) return;

  for (var name in obj) {
    if (obj.hasOwnProperty(name)) {
      var data = obj[name];
      var spell = this.spells[name];
      if (data && spell) {
        spell.durationLeft = data['durationLeft'];
        spell.cooldownLeft = data['cooldownLeft'];
        spell.status = data['status'];
      }
    }
  }
};

Game.prototype.loadMonsters = function(obj) {
  if (!obj) return;

  for (var name in obj) {
    if (obj.hasOwnProperty(name)) {
      var data = obj[name];
      var monster = this.monsters[name];
      if (data && monster) {
        monster.currentHealth = data['currentHealth'];
        monster.count = data['count'];
        monster.status = data['status'];

        monster.maxHealth = monster.startHealth + monster.startHealth * SCALE_MONSTER_HEALTH * monster.count;
      }
    }
  }
};

Game.prototype.recalculateState = function() {
  if (this.level == 19) this.experienceNeeded = 999990000000000000;
  else this.experienceNeeded *= Math.pow(SCALE_EXPERIENCE_NEEDED, this.level - 1);


  this.chimesExperience *= Math.pow(SCALE_CHIMES_EXPERIENCE, this.level - 1);

  var items = this.getObjectsByStatus(this.items);
  for (var i = 0; i < items.length; i++) {
    var item = this.items[items[i]];
    this.defenseStat += item.count * item.defenseStat;
    this.movespeedStat += item.count * item.movespeedStat;
    this.damageStat += item.count * item.damageStat;
    this.attackrateStat += item.count * item.attackrateStat;
    this.income += item.count * item.income;
  }

  var monsters = this.getObjectsByStatus(this.monsters, this.AVAILABLE);
  for (var i = 0; i < monsters.length; i++) {
    this.monsters[monsters[i]].experience /= 5;
  }

  this.damageStat += this.meeps * this.meepDamage;

  this.favorBonus = this.getFavorBonus() / 100;
  this.spoilsOfWarBonus = this.getSpoilsOfWarBonus() / 100;
  this.tributeBonus = this.getTributeBonus() / 100;
  this.igniteDamage = this.getIgniteDamage();
};

Game.prototype.newGame = function(reset, difficulty) {
  if (reset) {
    localStorage.removeItem('progress');
  }
  else {
    if (this.monsters[TEEMO].count > 0) {
      var points = (getBaseLog(20, this.monsters[TEEMO].count) + 1) * POINT_BONUS[this.difficulty];
      this.progress.general.points += points;
      this.progress.general.pointsEarned += points;
    }
    this.saveProgress();
  }
  localStorage.setItem('difficulty', difficulty ? DIFFICULTIES.indexOf(difficulty) : DIFFICULTIES.indexOf(this.difficulty));
  localStorage.removeItem('save');
  location.reload(true);
}
