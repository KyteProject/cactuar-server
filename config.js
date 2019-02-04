let config = {
// ARTFX Master
    TOKEN: "MzUxNjc1MzUxMzY3NDE3ODcw.DJXkSA.jlyjrxzWhZG3nqxE08ZM6u77bpI",
    CLIENT_ID: "351675351367417870",
    MSGPATH: `${__dirname.replace(/\\/g, "/")}/messages/`,
    QUESTION: 'questionkeywords.cvs',
    ANSWER: 'answerkeywords.cvs',
    CMDPREFIX: ">"
};

console.log(config.MSGPATH);
module.exports = config;