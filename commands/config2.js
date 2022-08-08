
// config check template: client.configMap.get(message.guild.id).options[#].selection==#
// NO!
// config check template: client.configcall.get(client, message, "name")==#


exports.run = (client, message, args) => {
	if(!client.funcall.dmcheck(client,message)){
		message.channel.send("Only a DM can use this command! Make sure to give yourself a role named \"DM\" if you're in charge!");
		return;
	}

	if(!args[0]){
		message.channel.send("You need to specify a config to check!");
		return;
	}

	let mess = args[0].toUpperCase();

	if(args[1]){
		client.configcall.set(client, message, args[0], args[1]);
	}

	let configSelection = client.configcall.get(client, message, args[0]);
	mess += `: ${configSelection}`;
	// mess += `\nAs readable: ${client.configcall.get(client, message, args[0])+1}`;

	message.channel.send(mess);
	return;
}