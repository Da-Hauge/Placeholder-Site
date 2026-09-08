/* =========================================================================
   haug-it.eu — MCU tracker: trivia + "what you'd miss" notes.

   Kept separate from js/mcu-data.js on purpose: this is hand-written
   editorial content (not sourced facts like dates/scores), and keeping it
   in its own file means a factual correction to mcu-data.js never touches
   this file and vice versa.

   Coverage: only "essential" and "recommended" tier CORE titles get an
   entry here — those are the ones where "what would I miss by skipping
   this" actually matters. "optional"/"skippable" titles and the non-MCU
   secondary list intentionally have none; the detail view just omits the
   section when there's nothing for an id. See mcu/methodology.html.

   `skip` is written as a mild spoiler (what plot thread this sets up) and
   is shown behind a click-to-reveal in the UI — never rendered open by
   default. `trivia` is ordinary behind-the-scenes/insider info, not a
   spoiler, and is shown openly.
   ========================================================================= */

window.MCU_EXTRAS = {
  "iron-man": {
    trivia: ["Much of Tony Stark's dialogue was improvised by Robert Downey Jr. around a loose script outline — unusual for a tentpole blockbuster.", "The suitcase Iron Man armor from Iron Man 2 was already planned as a nod during this film's production."],
    skip: "Introduces Tony Stark, Iron Man, Obadiah Stane, and — in the first-ever MCU post-credits scene — Nick Fury proposing the 'Avengers Initiative'. Skipping this means starting the franchise's core relationship (Tony/Fury/SHIELD) mid-stream."
  },
  "captain-america-first-avenger": {
    trivia: ["Chris Evans initially turned the role down twice before accepting.", "The pre-serum 'skinny Steve' effect combined old-school techniques with then-new digital head replacement work."],
    skip: "Introduces Steve Rogers, Bucky Barnes, Peggy Carter, the Tesseract (later an Infinity Stone), and HYDRA/Red Skull. Steve ends the film frozen in ice until The Avengers — skipping it means meeting a fully-formed Captain America with no context for his central relationships."
  },
  "the-avengers": {
    trivia: ["Joss Whedon rewrote much of the third act during filming after test audiences found the original ending confusing.", "The famous 360-degree 'hero shot' in the final battle was one continuous shot stitched from multiple takes."],
    skip: "The team formally assembles for the first time; Loki and the Chitauri invade New York with the Tesseract. Establishes the working group dynamic every later Avengers film builds on."
  },
  "captain-america-winter-soldier": {
    trivia: ["The elevator fight scene took 10 days to film for about 3 minutes of screen time.", "Widely credited with shifting the MCU's house style toward grounded political thrillers."],
    skip: "SHIELD is revealed to have been infiltrated by HYDRA since its founding and is publicly dissolved; Bucky Barnes is revealed alive as the brainwashed Winter Soldier. This reshapes who the 'authorities' even are for the rest of the saga."
  },
  "guardians-of-the-galaxy": {
    trivia: ["Vin Diesel recorded 'I am Groot' in five different languages and dozens of intonations so editors could pick the right emotional read for each scene.", "The soundtrack's success (Awesome Mix Vol. 1) predates the film's release strategy — Marvel didn't initially expect it to become a chart hit."],
    skip: "Introduces the cosmic side of the MCU (Star-Lord, Gamora, Drax, Rocket, Groot, the Infinity Stones as a concept, Thanos as a real threat) that Avengers: Infinity War later depends on entirely."
  },
  "avengers-age-of-ultron": {
    trivia: ["Ultron's voice, performed by James Spader, was recorded live on set rather than added in post-production, which is unusual for a fully CG character."],
    skip: "Introduces Vision, and gives Wanda Maximoff and Pietro Maximoff (Quicksilver) their powers; the team splinters over collateral damage, seeding the Sokovia Accords conflict in Civil War. Pietro dies in this film."
  },
  "captain-america-civil-war": {
    trivia: ["Functions almost as 'Avengers 2.5' — it has a larger action-hero cast than either prior Avengers film.", "The airport battle sequence took about two weeks to shoot."],
    skip: "The Avengers split into two factions over government oversight (the Sokovia Accords); Bucky's brainwashing trigger words are exposed; Tony discovers his parents were killed by Bucky. Introduces the MCU's Spider-Man and Black Panther. The team stays fractured until Infinity War."
  },
  "doctor-strange": {
    trivia: ["The kaleidoscopic 'mirror dimension' visuals drew heavily on M.C. Escher's impossible architecture."],
    skip: "Introduces Stephen Strange, the Sanctum Sanctorum, and magic/the multiverse as a real concept in the MCU — load-bearing for everything from Infinity War onward, and directly for Phase 4-6's multiverse plotlines."
  },
  "guardians-vol-2": {
    trivia: ["Has five separate post-credits scenes, the most of any MCU film."],
    skip: "Reveals Star-Lord's father is Ego, a Celestial; Yondu sacrifices himself and is honored with a Ravager funeral. Introduces Mantis and sets up Guardians' family dynamic for Vol. 3."
  },
  "spider-man-homecoming": {
    trivia: ["Filmed largely on real Atlanta-area locations rather than soundstages to keep Peter's world feeling like an ordinary suburb."],
    skip: "Establishes Peter Parker as a teenager mentored (at a distance) by Tony Stark, introduces the Vulture, and sets Peter's arc toward greater Avengers involvement."
  },
  "thor-ragnarok": {
    trivia: ["Director Taika Waititi encouraged heavy improvisation, especially between Thor and Hulk."],
    skip: "Asgard is destroyed and most of its population evacuated; Hela (the Goddess of Death) is defeated but Thanos intercepts the refugee ship in Infinity War's opening minutes as a direct result."
  },
  "black-panther": {
    trivia: ["Wakanda's fictional language draws on real Xhosa, with Xhosa-speaking actors coaching the cast."],
    skip: "Establishes Wakanda as a hidden technological superpower, T'Challa as its king, and Killmonger's challenge to the throne — all central to Wakanda Forever and Wakanda's role in later films."
  },
  "avengers-infinity-war": {
    trivia: ["Thanos was shot via motion capture with Josh Brolin performing on-set opposite the other actors, not added later."],
    skip: "Thanos collects all six Infinity Stones and erases half of all life in the universe ('the Snap'), including several major heroes. Endgame is a direct, immediate continuation."
  },
  "avengers-endgame": {
    trivia: ["At the time of release it was the highest-grossing film ever, unseating Avatar (later re-overtaken)."],
    skip: "The surviving Avengers undo the Snap via time travel, defeat a past version of Thanos, and several original Avengers exit the franchise (Iron Man dies, Captain America retires). This closes the Infinity Saga and resets the status quo for everything after."
  },
  "spider-man-far-from-home": {
    trivia: ["Filmed on location across several European cities during its Europe-set second half."],
    skip: "Mysterio frames Peter and publicly reveals his identity as Spider-Man in the mid-credits scene — the direct setup for No Way Home."
  },
  "wandavision": {
    trivia: ["Each early episode recreates the look of a different decade of American sitcoms, in order."],
    skip: "Reveals Wanda Maximoff's grief-driven reality warping over Westview, introduces Agatha Harkness properly, and sets up both Doctor Strange in the Multiverse of Madness and Agatha All Along."
  },
  "loki-s1": {
    trivia: ["The TVA's retro-futuristic 1970s aesthetic was a deliberate choice to make an all-powerful bureaucracy feel mundane."],
    skip: "Reveals the 'Sacred Timeline' was an artificial construct maintained by the TVA; Loki's actions at the finale fracture it into a true multiverse and introduce Kang variants — the mechanism behind the entire Multiverse Saga."
  },
  "shang-chi": {
    trivia: ["Combines Hong Kong-style wire-fu choreography with Western blockbuster staging, deliberately."],
    skip: "Introduces the Ten Rings (ancient, powerful alien technology) and Shang-Chi's family; the artifacts and his role recur through the current saga's later chapters."
  },
  "spider-man-no-way-home": {
    trivia: ["Marketing deliberately denied Tobey Maguire and Andrew Garfield's involvement for months before release."],
    skip: "Multiversal spell fallout brings villains (and the two prior non-MCU Spider-Men) into the MCU; Peter Parker's identity and history are erased from everyone's memory at the end, resetting his supporting cast relationships going forward."
  },
  "doctor-strange-multiverse-of-madness": {
    trivia: ["Sam Raimi's return to horror-style filmmaking is felt heavily in the visual language."],
    skip: "Reveals the Illuminati of another universe and America Chavez's reality-hopping powers; Wanda's arc from WandaVision is resolved (for now); establishes concrete multiverse incursions as an active threat."
  },
  "guardians-vol-3": {
    trivia: ["Writer/director James Gunn made Rocket Raccoon's backstory the emotional spine of the whole film."],
    skip: "Closes out the original Guardians roster's arc — several members leave the team by the end, and Rocket's origin (the High Evolutionary) is fully explored."
  },
  "deadpool-wolverine": {
    trivia: ["Numerous cameos draw specifically from the cancelled or unreleased Fox-era X-Men/Marvel projects, as a form of on-screen closure for actors whose films never got made."],
    skip: "Formally establishes that the (non-MCU) Fox X-Men universe is one of the 'dead' timelines the TVA used to prune, folding decades of Fox Marvel films into MCU multiverse lore — the direct setup for the X-Men appearing in Avengers: Doomsday."
  },
  "captain-america-brave-new-world": {
    trivia: ["Sam Wilson's shield-less early fight choreography was designed specifically to distinguish his fighting style from Steve Rogers'."],
    skip: "Sam Wilson, as the new Captain America, begins assembling a new Avengers roster; introduces adamantium and the Celestial Tiamut's body under Wakanda's ocean as a coming geopolitical flashpoint."
  },
  "thunderbolts": {
    trivia: ["The team's mid-film transformation into 'The New Avengers' was kept out of marketing until release."],
    skip: "A team of morally grey former operatives becomes the New Avengers and takes over the (rebranded) Avengers headquarters; the end-credits scene ties directly into the Fantastic Four's arrival and Avengers: Doomsday."
  },
  "fantastic-four-first-steps": {
    trivia: ["Set on an alternate, retro-futuristic Earth (numbered separately from the MCU's main Earth) rather than the primary timeline."],
    skip: "Introduces the Fantastic Four and Galactus as a cosmic threat; the mid-credits scene shows their world colliding with the mainline MCU, which is the direct lead-in to Avengers: Doomsday."
  },
  "spider-man-brand-new-day": {
    trivia: ["The first MCU Spider-Man film made after Peter's identity/history reset at the end of No Way Home."],
    skip: "Re-establishes Peter Parker's place among the wider Avengers-adjacent cast just before Avengers: Doomsday."
  },
  "avengers-doomsday": {
    trivia: ["Reunites several actors from the non-MCU Fox X-Men films alongside the mainline Avengers cast."],
    skip: "Unreleased as of this data's capture date — treat any 'what you'd miss' claim here as an announced expectation, not confirmed plot."
  },
  "avengers-secret-wars": {
    trivia: ["Announced as the direct sequel to and closer of Avengers: Doomsday."],
    skip: "Unreleased as of this data's capture date and outside the tracker's stated 'to Doomsday' scope — included because it already has a confirmed date, not because its plot is known."
  },

  "thor": {
    trivia: ["Kenneth Branagh, known for Shakespeare adaptations, was hired specifically to lean into the story's operatic family-drama register."],
    skip: "Introduces Asgard, Loki as Thor's adopted brother and his resentment over the throne, and the Bifrost. Sets up Loki as The Avengers' antagonist."
  },
  "iron-man-3": {
    trivia: ["Shane Black's screenplay deliberately subverted the 'Mandarin' comic villain with a mid-film twist that split fan opinion at release."],
    skip: "Tony works through PTSD from the Battle of New York; destroys his armor fleet and (temporarily) has the shrapnel removed from his chest, ending the original arc reactor era of his story."
  },
  "ant-man": {
    trivia: ["Edgar Wright developed the film for nearly a decade before departing shortly before production over creative differences; Peyton Reed took over."],
    skip: "Introduces Scott Lang, Hank Pym, Hope van Dyne, and the Quantum Realm — the mechanism Endgame's time-heist later depends on."
  },
  "ant-man-and-the-wasp": {
    trivia: ["Was filmed and released in the gap between Infinity War and Endgame, and is set explicitly before Thanos's Snap."],
    skip: "Explores the Quantum Realm further with Janet van Dyne's rescue; the end-credits scene shows Scott trapped there when the Snap happens, explaining his absence and reappearance in Endgame."
  },
  "captain-marvel": {
    trivia: ["Set in the 1990s, it's the first mainline MCU film to be a period piece relative to its release."],
    skip: "Establishes Carol Danvers' backstory and her history with Nick Fury; explains Fury's eye injury and the origin of the pager he uses at the end of Infinity War to call her."
  },
  "falcon-winter-soldier": {
    trivia: ["The series directly addresses the real-world politics of a Black man taking up the Captain America shield, unusually for the MCU."],
    skip: "Sam Wilson ultimately accepts the mantle of Captain America, which pays off directly in Brave New World; introduces the new Captain America (John Walker/US Agent) and Sharon Carter's fall from grace."
  },
  "what-if-s1": {
    trivia: ["Each episode is voiced largely by the film cast reprising their roles, recorded remotely."],
    skip: "An anthology of alternate timelines; the season finale has the Watcher break his non-interference oath, seeding his active role in the wider Multiverse Saga."
  },
  "hawkeye": {
    trivia: ["Filmed on location in New York City during the actual winter holiday season for authenticity."],
    skip: "Introduces Kate Bishop and Yelena Belova's contract to kill Clint Barton (over Natasha's death); sets up both characters' larger roles going forward."
  },
  "ms-marvel": {
    trivia: ["The visual effects for Kamala's powers were designed to look hand-drawn/comic-inspired rather than photorealistic, a deliberate stylistic choice."],
    skip: "Introduces Kamala Khan and her powers just ahead of her role in The Marvels."
  },
  "black-panther-wakanda-forever": {
    trivia: ["Made after Chadwick Boseman's death, with the film rewritten to center Wakanda's response to losing T'Challa rather than recasting the role."],
    skip: "Introduces Namor and Talokan; Shuri becomes the new Black Panther; Riri Williams (Ironheart) is introduced."
  },
  "secret-invasion": {
    trivia: ["Uses an AI-generated opening title sequence, which drew significant public debate at release."],
    skip: "Reveals a Skrull rebellion against Nick Fury and humanity; Fury's status and trust in the Skrulls is reshaped going forward."
  },
  "agatha-all-along": {
    trivia: ["A direct spin-off built around the breakout response to Kathryn Hahn's WandaVision performance."],
    skip: "Explores Agatha Harkness's history and introduces Wanda's son Billy Maximoff finding his powers — a direct Young Avengers setup."
  },
  "daredevil-born-again-s1": {
    trivia: ["Went through a significant creative overhaul mid-production, reportedly closer in tone to the original Netflix series than first planned."],
    skip: "Brings Matt Murdock/Daredevil and Wilson Fisk/Kingpin (as NYC mayor) fully into the core MCU continuity."
  },
  "ironheart": {
    trivia: ["Riri Williams was first introduced in Wakanda Forever; this series is her first solo spotlight."],
    skip: "Develops Riri Williams' own hero identity and technology outside Wakanda's orbit, ahead of a expected New Avengers/Young Avengers role."
  },
  "wonder-man": {
    trivia: ["Framed partly as a satire of the entertainment industry, unusually self-aware in tone for the MCU."],
    skip: "Introduces Simon Williams (Wonder Man) into the wider Avengers-adjacent cast."
  },
  "visionquest": {
    trivia: ["A direct continuation of Vision's fate from the end of WandaVision, where a 'White Vision' regained his memories but left without his emotions."],
    skip: "Unreleased as of this data's capture date; expected to follow directly from WandaVision's ending."
  }
};
