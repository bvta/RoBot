const Discord = require('discord.js');

module.exports = {
    name: 'mods',
    type: 'utility',
    usage: 'mods',
    permission: 1,
    help: 'Gives you information about the server moderators.',
    main: function (bot, msg) {
        var members = []
        var role = {
            "name": "",
            "position": 0,
            "members": []
        }
        var thisRole = 0;
        var pos = 0;

        msg.guild.members.forEach(member => {
            if (member.hasPermission("MANAGE_MESSAGES") && !member.user.bot) {
                var found = false;
                for (var i = 0; i < members.length; i++) {
                    if (members[i].name == member.hoistRole.name) {
                        found = true;
                        members[i].members.push(member)
                        break;
                    }
                }
                if (!found) {
                    var temp = role;
                    temp.name = member.hoistRole.name;
                    temp.position = member.hoistRole.position;
                    temp.members.push(member)
                    members.push(temp);
                }
            }
        });

        var mods = new Discord.RichEmbed()
            .setTitle("Moderators on " + msg.guild.name)
            .setThumbnail(msg.guild.iconURL)
            .setFooter("Powered by RoBot", bot.user.iconURL)
            .setTimestamp()

        for (var i = 0; i < members.length; i++) {
            if (members[i].position > thisRole) {
                thisRole = members[i].position;
                pos = i;
            }
        }

        while (true) {
            var str = ""
            var arr = members[pos].members;

            for (var i = 0; i < arr.length; i++) {
                var user = arr[i].user;
                if (user.presence.status == 'offline')
                    str += "<:offline:313956277237710868> **" + arr[i].displayName + "**\n"
                else if (user.presence.status == 'idle')
                    str += "<:away:313956277220802560> **" + arr[i].displayName + "**\n"
                else if (user.presence.status == 'online')
                    str += "<:online:313956277808005120> **" + arr[i].displayName + "**\n"
                else if (user.presence.status == 'dnd')
                    str += "<:dnd:313956276893646850> **" + arr[i].displayName + "**\n"
            }

            console.log(members[pos].name);
            console.log(str);

            mods.addField(members[pos].name, str);

            var temp = 0

            for (var i = 0; i < members.length; i++) {
                if (members[i].position > temp && members[i].position < thisRole) {
                    temp = members[i].position;
                    pos = i;
                }
            }

            if (temp == 0)
                break;
        }

        msg.channel.send({ embed: mods })
    }
};