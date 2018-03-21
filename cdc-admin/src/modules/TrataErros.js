import PubSub from 'pubsub-js';

export default class TrataErros {
    publicaErros(err) {
        for(var i = 0; i < err.errors.length; i++) {
            var erro = err.errors[i];
            
            PubSub.publish('error-validation', erro);
        }
    }
};