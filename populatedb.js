#! /usr/bin/env node
// mongodb+srv://benodkk:Njbinpsx99@cluster0.g6yff2q.mongodb.net/?retryWrites=true&w=majority
console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Instrument = require('./models/instrument')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var instruments = []
var categories = []


function instrumentCreate(name, description, category, price, nrInStock, cb) {
  instrumentdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    nrInStock: nrInStock,
  }

  let instrument = new Instrument(instrumentdetail)
       
  instrument.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New instrument: ' + instrument);
    instruments.push(instrument)
    cb(null, instrument);
  }   );
}

function categoryCreate(name, description, cb) {
  categorydetail = { 
    name: name,
    description: description,
  }
    
  let category = new Category(categorydetail);    

  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}


function createCategories(cb) {
    async.parallel([
        function(callback) {
          categoryCreate('Wind instrument','A wind instrument is a musical instrument that contains some type of resonator (usually a tube) in which a column of air is set into vibration by the player blowing into (or over) a mouthpiece set at or near the end of the resonator. The pitch of the vibration is determined by the length of the tube and by manual modifications of the effective length of the vibrating column of air. In the case of some wind instruments, sound is produced by blowing through a reed; others require buzzing into a metal mouthpiece, while yet others require the player to blow into a hole at an edge, which splits the air column and creates the sound.', callback);
        },
        function(callback) {
          categoryCreate('String instrument','String instruments, stringed instruments, or chordophones are musical instruments that produce sound from vibrating strings when a performer plays or sounds the strings in some manner. Musicians play some string instruments by plucking the strings with their fingers or a plectrum—and others by hitting the strings with a light wooden hammer or by rubbing the strings with a bow. In some keyboard instruments, such as the harpsichord, the musician presses a key that plucks the string. Other musical instruments generate sound by striking the string. With bowed instruments, the player pulls a rosined horsehair bow across the strings, causing them to vibrate. With a hurdy-gurdy, the musician cranks a wheel whose rosined edge touches the strings.', callback);
        },
        ],
        // optional callback
        cb);
}

function createInstruments(cb) {
    async.series([
        function(callback) {
          instrumentCreate('Trumpet', 'The trumpet is a brass instrument commonly used in classical and jazz ensembles. The trumpet group ranges from the piccolo trumpet—with the highest register in the brass family—to the bass trumpet, pitched one octave below the standard B♭ or C trumpet.',categories[0], '120$' , 5, callback);
        },
        function(callback) {
          instrumentCreate('Trombone', 'The trombone (German: Posaune, Italian, French: trombone) is a musical instrument in the brass family. As with all brass instruments, sound is produced when the players vibrating lips cause the air column inside the instrument to vibrate. Nearly all trombones use a telescoping slide mechanism to alter the pitch instead of the valves used by other brass instruments. The valve trombone is an exception, using three valves similar to those on a trumpet, and the superbone has valves and a slide.',categories[0], '150$' , 9, callback);
        },
        function(callback) {
          instrumentCreate('Clarinet', 'The clarinet is a type of single-reed woodwind instrument. Like many wind instruments, clarinets are made in several different sizes, each having its own range of pitches. All have a nearly-cylindrical bore and a flared bell, and utilize a mouthpiece with a single reed. A person who plays a clarinet is called a clarinetist (sometimes spelled clarinettist).',categories[0], '250$' , 19, callback);
        },
        function(callback) {
          instrumentCreate('Saxophone', 'The saxophone is a type of single-reed woodwind instrument with a conical body, usually made of brass. As with all single-reed instruments, sound is produced when a reed on a mouthpiece vibrates to produce a sound wave inside the instruments body. The pitch is controlled by opening and closing holes in the body to change the effective length of the tube. The holes are closed by leather pads attached to keys operated by the player. Saxophones are made in various sizes and are almost always treated as transposing instruments. Saxophone players are called saxophonists',categories[0], '160$' , 3, callback);
        },
        function(callback) {
          instrumentCreate('Piano', 'The piano is a stringed keyboard instrument in which the strings are struck by wooden hammers that are coated with a softer material (modern hammers are covered with dense wool felt; some early pianos used leather). It is played using a keyboard, which is a row of keys (small levers) that the performer presses down or strikes with the fingers and thumbs of both hands to cause the hammers to strike the strings. It was invented in Italy by Bartolomeo Cristofori around the year 1700.',categories[1], '1500$' , 7, callback);
        },
        function(callback) {
          instrumentCreate('Violin', 'The violin, sometimes known as a fiddle, is a wooden chordophone (string instrument) in the violin family. Most violins have a hollow wooden body. It is the smallest and thus highest-pitched instrument (soprano) in the family in regular use.[a] The violin typically has four strings (some can have five), usually tuned in perfect fifths with notes G3, D4, A4, E5, and is most commonly played by drawing a bow across its strings. It can also be played by plucking the strings with the fingers (pizzicato) and, in specialized cases, by striking the strings with the wooden side of the bow (col legno).',categories[1], '500$' , 4, callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
    createCategories,
    createInstruments,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



