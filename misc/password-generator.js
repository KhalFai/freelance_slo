let passgen = {
    generate: function(length) {
        let randomZnaki = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for ( var i = 0; i < length; i++ ) {
         result += randomZnaki.charAt(Math.floor(Math.random() * randomZnaki.length));
        }
        
        return result;
    }
}

module.exports = passgen;