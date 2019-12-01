let channel, user, timerRunning = false, shoudStop = false
const db = require('./db')
const interval = require('interval-promise')
module.exports = {
    receiveMessage: (bot, msg) => {
        command = switchMessage(msg)
    }
}
switchMessage = (msg) => {
    defineChannel(msg)
    msgSplit = msg.content.split(' ')
    text = msgSplit[1]
    switch (text) {
        case 'config':
            return makeChannel(msg, "wplayer")
        case 'start':
            return startService(msg, msgSplit[2]) 
        case 'stop':
            return stopTimer(msg) 
        case 'help': 
            msg.reply(`Comandos disponíveis: 
                -> wp config : Configura e deixa o servidor apto a fazer o monitoramento 
                -> wp start [email] : Começa a monitorar todas as máquinas referentes a determinado email
                -> wp stop : para o monitoramento 
                -> wp help : para obter ajuda
            `)
            break
        default:
            msg.reply("Comando não reconhecido! use wp help para mais informações!")
            break;
    }
}
defineChannel = (message) => {
    channel = message.guild.channels.find(channel => channel.name === "wplayer")
}

makeChannel = (message, name) => {  
    if (channel == null) {
        message.guild.createChannel(name, "text")
        message.reply("configuração concluída, utilize 'wp start [email]' para conmeçar o monitoramento")
    } else
        message.reply("a configuração já foi feita!")
}

startService = async (message, CUSTOMER_EMAIL) => {
    if (channel == null) {
        message.reply("o servidor atual não está configurado, tente usar 'wp config' para configurar")
    }else if(timerRunning){
        message.reply("o monitoramento já está ativo!")
    }else{
        message.reply('monitoramento iniciado!')
        user = await db('CUSTOMER').where({CUSTOMER_EMAIL}).first()
        console.log(user);
        if (user == undefined) {
            message.reply("usuário com email "+ CUSTOMER_EMAIL +" não encontrado")
        }else{
            shoudStop = false
            timerRunning = true
            interval(async (iteration, stop) => {
                if (shoudStop) {
                    stop()
                }else{
                    await getMachines(user.CUSTOMER_ID)
                } 
            }, 60000)
        }
    }
}

getMachines = async (CUSTOMER_ID) =>{
    var machines = await db('VW_CORP_MACHINES').where({CUSTOMER_ID}).orderBy('COMPUTER_STATE', 'asc')
    console.log(machines);
    for(machine of machines){
        switch (machine.COMPUTER_STATE) {
            case 'danger':
                channel.send("⚠️ "+machine.MACHINE_NAME + ' está em estado de alerta')
                channel.send("Acesse http://localhost:5000/machine/"+machine.MACHINE_KEY+" para mais informações")
                break;
            case 'warning':
                channel.send("👀 "+machine.MACHINE_NAME + ' está em estado de atenção')
                channel.send("Acesse http://localhost:5000/machine/"+machine.MACHINE_KEY+" para mais informações")
                break;
            default:
                break;
        }
    }
}

stopTimer = (msg) =>{
    if (timerRunning) {
        msg.reply("o monitoramento pelo discord foi parado!")
        timerRunning = false
        shoudStop = true
        console.log("ZAWARUDO! TOKI YO TOMARE!");
    }else{
        channel.send('O monitoramento não está ativo no momento!')
    }
}