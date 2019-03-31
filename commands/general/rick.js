import Command from '../../structures/Command';

module.exports = class Rick extends Command {
  constructor( ...args ) {
    super( ...args, {
      name: 'rick',
      description: 'Have the bot say a random Rick & Morty quote',
      usage: '.rick',
      category: 'General'
    } );
  }

  async run( message, args ) {
    const quotes = [
      'Wubba-lubba-dub-dub!',
      'Rikki-Tikki-Tavi, biatch!',
      'And that\'s the waaaaay the news goes!',
      'Hit the sack, Jack!',
      'Uh-oh, somersault jump!',
      'AIDS!',
      'And that\'s why I always say, shum-shum-schlippety-dop!',
      'No jumpin\' in the sewer!',
      'Rubber baby bubby bunkers!',
      'Lick, lick, lick my balls! Ha ha ha, yeah! Say that all the time!',
      'Get off the high road. We all got pink eye because you won\'t stop texting on the toilet.',
      'We\'ve got a lot of friends and family to exterminate. ',
      'Uncertainty is inherently unsustainable. Eventually, everything either is or isn\'t.',
      'Stupid-ass, fart-saving, carpet-store motherfucker.',
      'Allah euuh... Akbar! We\'re gonna take control of this plane! We\'re gonna 9/11 it unless Morty Smith gets better grades in math! ',
      'Pickle Riiick!',
      'Get Schwifty',
      'Alright, Morty, I just gotta erhp combine it with some of your DNA.',
      'My life has been a lie! God is dead! The government\'s lame! Thanksgiving is about killing Indians! Jesus wasn\'t born on Christmas! They moved the date, it was a pagan holiday!',
      'And this is why you don\'t invite a Floopy Doop and a Shmoopy Doop to the same party.',
      'No, no, I haven\'t seen that. I mean, why would a Pop-Tart want to live inside a toaster, Rick? I mean, th-that would be like the scariest place for them to live. Y\'know what I mean?',
      'Get off the high road, Summer! We all got pinkeye because you won\'t stop texting on the toilet.',
      'Well, all is forgiven, because right now, I’ve got an erection the size of an East Coast lighthouse, and I’m coming home to share it with my beautiful wife.',
      'To live is to risk it all, otherwise you\'re just an inert chunk of randomly assembled molecules drifting wherever the universe blows you.',
      'I\'m Doctor Who in this motherfucker! I could be a clone! I could be a hologram! We could clones controlled by robots controlled by special headsets that the real Rick and Morty are wearing while they\'re fucking your mother!',
      'The universe is a little too big to care about something so small.',
      'Don\'t break an arm jerking yourself off, Morty.',
      'Come on, flip the pickle, Morty. You\'re not gonna regret it. The payoff is huge. I turned myself into a pickle, Morty! Boom! Big reveal! I\'m a pickle! What do you think about that? I turned myself into a pickle! W-what are you just staring at me for, bro? I turned myself into a pickle, Morty.',
      'When you know nothing matters, the universe is yours. And I\'ve never met a universe that was into it. The universe is basically an animal, it grazes on the ordinary. It creates infinite idiots, just to eat them, not unlike your friend Timmy.',
      'Listen, if the situation keeps on darkening, then you gotta do yourself a favor and pop by Pirates Of The Pancreas. I mean, the top priority is to, you know, get you guys out of there, but, I mean, if that becomes impossible then you gotta treat yourself.',
      'Mr. President, if I\'ve learned one thing today, it\'s that sometimes you have to not give a fuck!',
      'Wait for the ramp, Morty. They love the slow ramp. It really gets their dicks hard',
      'Morty, you gotta flip \'em off. I told them it means \'peace among worlds.\' How hilarious is that!',
      '60 for the resonator, and my grandson wants the sex robot.'
    ];

    message.channel.send( quotes.random() );
  }
};
