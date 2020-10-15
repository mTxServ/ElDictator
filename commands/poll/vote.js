const mTxServCommand = require('../mTxServCommand.js');
const Discord = require('discord.js');

module.exports = class VoteCommand extends mTxServCommand {
    constructor(client) {
        super(client, {
            name: 'vote',
            group: 'admin',
            memberName: 'vote',
            description: "Starts a yes/no/don't care vote.",
            examples: ['!vote "Do you like to vote?" "I mean who doesn\'t right?!" 5'],
            ownerOnly: true,
            hidden: true,
            guarded: true,
            args: [
                {
                    key: 'question',
                    prompt: 'What is the vote question?',
                    type: 'string',
                    validate: question => {
                        if (question.length < 101 && question.length > 11) return true;
                        return 'Polling questions must be between 10 and 100 characters in length.';
                    }
                },
                {
                    key: 'desc',
                    prompt: '(Optional) Do you have more details?',
                    type: 'string',
                    default: ' ',
                    validate: desc => {
                        if (desc.length < 201 && desc.length > 11) return true;
                        return 'Polling questions must be between 10 and 200 characters in length.';
                    }
                },
                {
                    key: 'time',
                    prompt: '(Optional) How long should the vote last in minutes?',
                    type: 'integer',
                    default: 0,
                    validate: time => {
                        if (time >= 0 && time <= 60) return true;
                        return 'Polling time must be between 0 and 60.';
                    }
                }
            ]
        });
    }

    run(msg, { question, desc, time }) {
        var emojiList = ['👍','👎','🤷'];
        var embed = new Discord.MessageEmbed()
            .setTitle(question)
            .setDescription(desc)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL)
            .setColor(0xD53C55) // Green: 0x00AE86
            .setTimestamp();

        if (time) {
            embed.setFooter(`The vote has started and will last ${time} minute(s)`)
        } else {
            embed.setFooter(`The vote has started and has no end time`)
        }

        msg.delete(); // Remove the user's command message

        msg.channel.send({embed}) // Use a 2d array?
            .then(async function (message) {
                var reactionArray = [];
                reactionArray[0] = await message.react(emojiList[0]);
                reactionArray[1] = await message.react(emojiList[1]);
                reactionArray[2] = await message.react(emojiList[2]);

                if (time) {
                    setTimeout(() => {
                        // Re-fetch the message and get reaction counts
                        message.channel.messages.fetch(message.id)
                            .then(async function (message) {
                                var reactionCountsArray = [];
                                for (let i = 0; i < reactionArray.length; i++) {
                                    reactionCountsArray[i] = message.reactions.cache.get(emojiList[i]).count-1;
                                }

                                // Find winner(s)
                                var max = -Infinity, indexMax = [];
                                for(let i = 0; i < reactionCountsArray.length; ++i)
                                    if(reactionCountsArray[i] > max) max = reactionCountsArray[i], indexMax = [i];
                                    else if(reactionCountsArray[i] === max) indexMax.push(i);

                                // Display winner(s)
                                var winnersText = "";
                                if (reactionCountsArray[indexMax[0]] == 0) {
                                    winnersText = "No one voted!"
                                } else {
                                    for (let i = 0; i < indexMax.length; i++) {
                                        winnersText +=
                                            emojiList[indexMax[i]] + " (" + reactionCountsArray[indexMax[i]] + " vote(s))\n";
                                    }
                                }
                                embed.setColor('GREEN')
                                embed.addField("**Winner(s):**", winnersText);
                                embed.setFooter(`The vote is now closed! It lasted ${time} minute(s)`);
                                embed.setTimestamp();
                                message.edit("", embed);
                            });
                    }, time * 60 * 1000);
                }
            }).catch(console.error);
    }
};