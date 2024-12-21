module.exports = {
    config: require('./config/config.json'),
    locations: require('./config/locations.json'),
    loginModel: require('./models/login'),
    campaignModel: require('./models/campaign'),
    bloodbankModel: require('./models/blood-bank'),
    bloodName: require('./config/blood.json')
}