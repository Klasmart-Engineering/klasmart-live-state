/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Command = (function() {

    /**
     * Properties of a Command.
     * @exports ICommand
     * @interface ICommand
     * @property {string|null} [id] Command id
     * @property {IEndClassCommand|null} [endClass] Command endClass
     * @property {ISetHostCommand|null} [setHost] Command setHost
     * @property {ISetContentCommand|null} [setContent] Command setContent
     * @property {ISetActivityStreamIdCommand|null} [setActvityStreamId] Command setActvityStreamId
     * @property {IRewardTrophyToUserCommand|null} [rewardTrophyToUser] Command rewardTrophyToUser
     * @property {IRewardTrophyToAllCommand|null} [rewardTrophyToAll] Command rewardTrophyToAll
     * @property {ISendChatMessageCommand|null} [sendChatMessage] Command sendChatMessage
     */

    /**
     * Constructs a new Command.
     * @exports Command
     * @classdesc Represents a Command.
     * @implements ICommand
     * @constructor
     * @param {ICommand=} [properties] Properties to set
     */
    function Command(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Command id.
     * @member {string} id
     * @memberof Command
     * @instance
     */
    Command.prototype.id = "";

    /**
     * Command endClass.
     * @member {IEndClassCommand|null|undefined} endClass
     * @memberof Command
     * @instance
     */
    Command.prototype.endClass = null;

    /**
     * Command setHost.
     * @member {ISetHostCommand|null|undefined} setHost
     * @memberof Command
     * @instance
     */
    Command.prototype.setHost = null;

    /**
     * Command setContent.
     * @member {ISetContentCommand|null|undefined} setContent
     * @memberof Command
     * @instance
     */
    Command.prototype.setContent = null;

    /**
     * Command setActvityStreamId.
     * @member {ISetActivityStreamIdCommand|null|undefined} setActvityStreamId
     * @memberof Command
     * @instance
     */
    Command.prototype.setActvityStreamId = null;

    /**
     * Command rewardTrophyToUser.
     * @member {IRewardTrophyToUserCommand|null|undefined} rewardTrophyToUser
     * @memberof Command
     * @instance
     */
    Command.prototype.rewardTrophyToUser = null;

    /**
     * Command rewardTrophyToAll.
     * @member {IRewardTrophyToAllCommand|null|undefined} rewardTrophyToAll
     * @memberof Command
     * @instance
     */
    Command.prototype.rewardTrophyToAll = null;

    /**
     * Command sendChatMessage.
     * @member {ISendChatMessageCommand|null|undefined} sendChatMessage
     * @memberof Command
     * @instance
     */
    Command.prototype.sendChatMessage = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Command command.
     * @member {"endClass"|"setHost"|"setContent"|"setActvityStreamId"|"rewardTrophyToUser"|"rewardTrophyToAll"|"sendChatMessage"|undefined} command
     * @memberof Command
     * @instance
     */
    Object.defineProperty(Command.prototype, "command", {
        get: $util.oneOfGetter($oneOfFields = ["endClass", "setHost", "setContent", "setActvityStreamId", "rewardTrophyToUser", "rewardTrophyToAll", "sendChatMessage"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Command instance using the specified properties.
     * @function create
     * @memberof Command
     * @static
     * @param {ICommand=} [properties] Properties to set
     * @returns {Command} Command instance
     */
    Command.create = function create(properties) {
        return new Command(properties);
    };

    /**
     * Encodes the specified Command message. Does not implicitly {@link Command.verify|verify} messages.
     * @function encode
     * @memberof Command
     * @static
     * @param {ICommand} message Command message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Command.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.endClass != null && Object.hasOwnProperty.call(message, "endClass"))
            $root.EndClassCommand.encode(message.endClass, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.setHost != null && Object.hasOwnProperty.call(message, "setHost"))
            $root.SetHostCommand.encode(message.setHost, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.setContent != null && Object.hasOwnProperty.call(message, "setContent"))
            $root.SetContentCommand.encode(message.setContent, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.setActvityStreamId != null && Object.hasOwnProperty.call(message, "setActvityStreamId"))
            $root.SetActivityStreamIdCommand.encode(message.setActvityStreamId, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.rewardTrophyToUser != null && Object.hasOwnProperty.call(message, "rewardTrophyToUser"))
            $root.RewardTrophyToUserCommand.encode(message.rewardTrophyToUser, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.rewardTrophyToAll != null && Object.hasOwnProperty.call(message, "rewardTrophyToAll"))
            $root.RewardTrophyToAllCommand.encode(message.rewardTrophyToAll, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.sendChatMessage != null && Object.hasOwnProperty.call(message, "sendChatMessage"))
            $root.SendChatMessageCommand.encode(message.sendChatMessage, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Command message, length delimited. Does not implicitly {@link Command.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Command
     * @static
     * @param {ICommand} message Command message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Command.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Command message from the specified reader or buffer.
     * @function decode
     * @memberof Command
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Command} Command
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Command.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Command();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.endClass = $root.EndClassCommand.decode(reader, reader.uint32());
                break;
            case 3:
                message.setHost = $root.SetHostCommand.decode(reader, reader.uint32());
                break;
            case 4:
                message.setContent = $root.SetContentCommand.decode(reader, reader.uint32());
                break;
            case 5:
                message.setActvityStreamId = $root.SetActivityStreamIdCommand.decode(reader, reader.uint32());
                break;
            case 6:
                message.rewardTrophyToUser = $root.RewardTrophyToUserCommand.decode(reader, reader.uint32());
                break;
            case 7:
                message.rewardTrophyToAll = $root.RewardTrophyToAllCommand.decode(reader, reader.uint32());
                break;
            case 8:
                message.sendChatMessage = $root.SendChatMessageCommand.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Command message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Command
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Command} Command
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Command.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Command message.
     * @function verify
     * @memberof Command
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Command.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.endClass != null && message.hasOwnProperty("endClass")) {
            properties.command = 1;
            {
                var error = $root.EndClassCommand.verify(message.endClass);
                if (error)
                    return "endClass." + error;
            }
        }
        if (message.setHost != null && message.hasOwnProperty("setHost")) {
            if (properties.command === 1)
                return "command: multiple values";
            properties.command = 1;
            {
                var error = $root.SetHostCommand.verify(message.setHost);
                if (error)
                    return "setHost." + error;
            }
        }
        if (message.setContent != null && message.hasOwnProperty("setContent")) {
            if (properties.command === 1)
                return "command: multiple values";
            properties.command = 1;
            {
                var error = $root.SetContentCommand.verify(message.setContent);
                if (error)
                    return "setContent." + error;
            }
        }
        if (message.setActvityStreamId != null && message.hasOwnProperty("setActvityStreamId")) {
            if (properties.command === 1)
                return "command: multiple values";
            properties.command = 1;
            {
                var error = $root.SetActivityStreamIdCommand.verify(message.setActvityStreamId);
                if (error)
                    return "setActvityStreamId." + error;
            }
        }
        if (message.rewardTrophyToUser != null && message.hasOwnProperty("rewardTrophyToUser")) {
            if (properties.command === 1)
                return "command: multiple values";
            properties.command = 1;
            {
                var error = $root.RewardTrophyToUserCommand.verify(message.rewardTrophyToUser);
                if (error)
                    return "rewardTrophyToUser." + error;
            }
        }
        if (message.rewardTrophyToAll != null && message.hasOwnProperty("rewardTrophyToAll")) {
            if (properties.command === 1)
                return "command: multiple values";
            properties.command = 1;
            {
                var error = $root.RewardTrophyToAllCommand.verify(message.rewardTrophyToAll);
                if (error)
                    return "rewardTrophyToAll." + error;
            }
        }
        if (message.sendChatMessage != null && message.hasOwnProperty("sendChatMessage")) {
            if (properties.command === 1)
                return "command: multiple values";
            properties.command = 1;
            {
                var error = $root.SendChatMessageCommand.verify(message.sendChatMessage);
                if (error)
                    return "sendChatMessage." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Command message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Command
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Command} Command
     */
    Command.fromObject = function fromObject(object) {
        if (object instanceof $root.Command)
            return object;
        var message = new $root.Command();
        if (object.id != null)
            message.id = String(object.id);
        if (object.endClass != null) {
            if (typeof object.endClass !== "object")
                throw TypeError(".Command.endClass: object expected");
            message.endClass = $root.EndClassCommand.fromObject(object.endClass);
        }
        if (object.setHost != null) {
            if (typeof object.setHost !== "object")
                throw TypeError(".Command.setHost: object expected");
            message.setHost = $root.SetHostCommand.fromObject(object.setHost);
        }
        if (object.setContent != null) {
            if (typeof object.setContent !== "object")
                throw TypeError(".Command.setContent: object expected");
            message.setContent = $root.SetContentCommand.fromObject(object.setContent);
        }
        if (object.setActvityStreamId != null) {
            if (typeof object.setActvityStreamId !== "object")
                throw TypeError(".Command.setActvityStreamId: object expected");
            message.setActvityStreamId = $root.SetActivityStreamIdCommand.fromObject(object.setActvityStreamId);
        }
        if (object.rewardTrophyToUser != null) {
            if (typeof object.rewardTrophyToUser !== "object")
                throw TypeError(".Command.rewardTrophyToUser: object expected");
            message.rewardTrophyToUser = $root.RewardTrophyToUserCommand.fromObject(object.rewardTrophyToUser);
        }
        if (object.rewardTrophyToAll != null) {
            if (typeof object.rewardTrophyToAll !== "object")
                throw TypeError(".Command.rewardTrophyToAll: object expected");
            message.rewardTrophyToAll = $root.RewardTrophyToAllCommand.fromObject(object.rewardTrophyToAll);
        }
        if (object.sendChatMessage != null) {
            if (typeof object.sendChatMessage !== "object")
                throw TypeError(".Command.sendChatMessage: object expected");
            message.sendChatMessage = $root.SendChatMessageCommand.fromObject(object.sendChatMessage);
        }
        return message;
    };

    /**
     * Creates a plain object from a Command message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Command
     * @static
     * @param {Command} message Command
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Command.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.id = "";
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.endClass != null && message.hasOwnProperty("endClass")) {
            object.endClass = $root.EndClassCommand.toObject(message.endClass, options);
            if (options.oneofs)
                object.command = "endClass";
        }
        if (message.setHost != null && message.hasOwnProperty("setHost")) {
            object.setHost = $root.SetHostCommand.toObject(message.setHost, options);
            if (options.oneofs)
                object.command = "setHost";
        }
        if (message.setContent != null && message.hasOwnProperty("setContent")) {
            object.setContent = $root.SetContentCommand.toObject(message.setContent, options);
            if (options.oneofs)
                object.command = "setContent";
        }
        if (message.setActvityStreamId != null && message.hasOwnProperty("setActvityStreamId")) {
            object.setActvityStreamId = $root.SetActivityStreamIdCommand.toObject(message.setActvityStreamId, options);
            if (options.oneofs)
                object.command = "setActvityStreamId";
        }
        if (message.rewardTrophyToUser != null && message.hasOwnProperty("rewardTrophyToUser")) {
            object.rewardTrophyToUser = $root.RewardTrophyToUserCommand.toObject(message.rewardTrophyToUser, options);
            if (options.oneofs)
                object.command = "rewardTrophyToUser";
        }
        if (message.rewardTrophyToAll != null && message.hasOwnProperty("rewardTrophyToAll")) {
            object.rewardTrophyToAll = $root.RewardTrophyToAllCommand.toObject(message.rewardTrophyToAll, options);
            if (options.oneofs)
                object.command = "rewardTrophyToAll";
        }
        if (message.sendChatMessage != null && message.hasOwnProperty("sendChatMessage")) {
            object.sendChatMessage = $root.SendChatMessageCommand.toObject(message.sendChatMessage, options);
            if (options.oneofs)
                object.command = "sendChatMessage";
        }
        return object;
    };

    /**
     * Converts this Command to JSON.
     * @function toJSON
     * @memberof Command
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Command.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Command;
})();

$root.CommandAcknowledgement = (function() {

    /**
     * Properties of a CommandAcknowledgement.
     * @exports ICommandAcknowledgement
     * @interface ICommandAcknowledgement
     * @property {string|null} [id] CommandAcknowledgement id
     * @property {string|null} [error] CommandAcknowledgement error
     * @property {number|null} [code] CommandAcknowledgement code
     */

    /**
     * Constructs a new CommandAcknowledgement.
     * @exports CommandAcknowledgement
     * @classdesc Represents a CommandAcknowledgement.
     * @implements ICommandAcknowledgement
     * @constructor
     * @param {ICommandAcknowledgement=} [properties] Properties to set
     */
    function CommandAcknowledgement(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CommandAcknowledgement id.
     * @member {string} id
     * @memberof CommandAcknowledgement
     * @instance
     */
    CommandAcknowledgement.prototype.id = "";

    /**
     * CommandAcknowledgement error.
     * @member {string} error
     * @memberof CommandAcknowledgement
     * @instance
     */
    CommandAcknowledgement.prototype.error = "";

    /**
     * CommandAcknowledgement code.
     * @member {number} code
     * @memberof CommandAcknowledgement
     * @instance
     */
    CommandAcknowledgement.prototype.code = 0;

    /**
     * Creates a new CommandAcknowledgement instance using the specified properties.
     * @function create
     * @memberof CommandAcknowledgement
     * @static
     * @param {ICommandAcknowledgement=} [properties] Properties to set
     * @returns {CommandAcknowledgement} CommandAcknowledgement instance
     */
    CommandAcknowledgement.create = function create(properties) {
        return new CommandAcknowledgement(properties);
    };

    /**
     * Encodes the specified CommandAcknowledgement message. Does not implicitly {@link CommandAcknowledgement.verify|verify} messages.
     * @function encode
     * @memberof CommandAcknowledgement
     * @static
     * @param {ICommandAcknowledgement} message CommandAcknowledgement message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommandAcknowledgement.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.error != null && Object.hasOwnProperty.call(message, "error"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.error);
        if (message.code != null && Object.hasOwnProperty.call(message, "code"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.code);
        return writer;
    };

    /**
     * Encodes the specified CommandAcknowledgement message, length delimited. Does not implicitly {@link CommandAcknowledgement.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CommandAcknowledgement
     * @static
     * @param {ICommandAcknowledgement} message CommandAcknowledgement message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommandAcknowledgement.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CommandAcknowledgement message from the specified reader or buffer.
     * @function decode
     * @memberof CommandAcknowledgement
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CommandAcknowledgement} CommandAcknowledgement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommandAcknowledgement.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CommandAcknowledgement();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.error = reader.string();
                break;
            case 3:
                message.code = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CommandAcknowledgement message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CommandAcknowledgement
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CommandAcknowledgement} CommandAcknowledgement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommandAcknowledgement.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CommandAcknowledgement message.
     * @function verify
     * @memberof CommandAcknowledgement
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CommandAcknowledgement.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.error != null && message.hasOwnProperty("error"))
            if (!$util.isString(message.error))
                return "error: string expected";
        if (message.code != null && message.hasOwnProperty("code"))
            if (!$util.isInteger(message.code))
                return "code: integer expected";
        return null;
    };

    /**
     * Creates a CommandAcknowledgement message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CommandAcknowledgement
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CommandAcknowledgement} CommandAcknowledgement
     */
    CommandAcknowledgement.fromObject = function fromObject(object) {
        if (object instanceof $root.CommandAcknowledgement)
            return object;
        var message = new $root.CommandAcknowledgement();
        if (object.id != null)
            message.id = String(object.id);
        if (object.error != null)
            message.error = String(object.error);
        if (object.code != null)
            message.code = object.code >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a CommandAcknowledgement message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CommandAcknowledgement
     * @static
     * @param {CommandAcknowledgement} message CommandAcknowledgement
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CommandAcknowledgement.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.id = "";
            object.error = "";
            object.code = 0;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.error != null && message.hasOwnProperty("error"))
            object.error = message.error;
        if (message.code != null && message.hasOwnProperty("code"))
            object.code = message.code;
        return object;
    };

    /**
     * Converts this CommandAcknowledgement to JSON.
     * @function toJSON
     * @memberof CommandAcknowledgement
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CommandAcknowledgement.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CommandAcknowledgement;
})();

$root.Event = (function() {

    /**
     * Properties of an Event.
     * @exports IEvent
     * @interface IEvent
     * @property {string|null} [id] Event id
     * @property {ISetClassStateEvent|null} [setRoomState] Event setRoomState
     * @property {IClassEndedEvent|null} [classEnded] Event classEnded
     * @property {IUserJoinedClassEvent|null} [userJoinedClass] Event userJoinedClass
     * @property {IUserLeftClassEvent|null} [userLeftClass] Event userLeftClass
     * @property {IHostChangedEvent|null} [hostChanged] Event hostChanged
     * @property {IContentChangedEvent|null} [contentChanged] Event contentChanged
     * @property {INewChatMessageEvent|null} [newChatMessage] Event newChatMessage
     * @property {IActivityStreamIdChangedEvent|null} [actvityStreamIdChanged] Event actvityStreamIdChanged
     * @property {ITrophyRewardedToUserEvent|null} [trophyRewardedToUser] Event trophyRewardedToUser
     * @property {ITrophyRewardedToAllEvent|null} [trophyRewardedToAll] Event trophyRewardedToAll
     */

    /**
     * Constructs a new Event.
     * @exports Event
     * @classdesc Represents an Event.
     * @implements IEvent
     * @constructor
     * @param {IEvent=} [properties] Properties to set
     */
    function Event(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Event id.
     * @member {string} id
     * @memberof Event
     * @instance
     */
    Event.prototype.id = "";

    /**
     * Event setRoomState.
     * @member {ISetClassStateEvent|null|undefined} setRoomState
     * @memberof Event
     * @instance
     */
    Event.prototype.setRoomState = null;

    /**
     * Event classEnded.
     * @member {IClassEndedEvent|null|undefined} classEnded
     * @memberof Event
     * @instance
     */
    Event.prototype.classEnded = null;

    /**
     * Event userJoinedClass.
     * @member {IUserJoinedClassEvent|null|undefined} userJoinedClass
     * @memberof Event
     * @instance
     */
    Event.prototype.userJoinedClass = null;

    /**
     * Event userLeftClass.
     * @member {IUserLeftClassEvent|null|undefined} userLeftClass
     * @memberof Event
     * @instance
     */
    Event.prototype.userLeftClass = null;

    /**
     * Event hostChanged.
     * @member {IHostChangedEvent|null|undefined} hostChanged
     * @memberof Event
     * @instance
     */
    Event.prototype.hostChanged = null;

    /**
     * Event contentChanged.
     * @member {IContentChangedEvent|null|undefined} contentChanged
     * @memberof Event
     * @instance
     */
    Event.prototype.contentChanged = null;

    /**
     * Event newChatMessage.
     * @member {INewChatMessageEvent|null|undefined} newChatMessage
     * @memberof Event
     * @instance
     */
    Event.prototype.newChatMessage = null;

    /**
     * Event actvityStreamIdChanged.
     * @member {IActivityStreamIdChangedEvent|null|undefined} actvityStreamIdChanged
     * @memberof Event
     * @instance
     */
    Event.prototype.actvityStreamIdChanged = null;

    /**
     * Event trophyRewardedToUser.
     * @member {ITrophyRewardedToUserEvent|null|undefined} trophyRewardedToUser
     * @memberof Event
     * @instance
     */
    Event.prototype.trophyRewardedToUser = null;

    /**
     * Event trophyRewardedToAll.
     * @member {ITrophyRewardedToAllEvent|null|undefined} trophyRewardedToAll
     * @memberof Event
     * @instance
     */
    Event.prototype.trophyRewardedToAll = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Event event.
     * @member {"setRoomState"|"classEnded"|"userJoinedClass"|"userLeftClass"|"hostChanged"|"contentChanged"|"newChatMessage"|"actvityStreamIdChanged"|"trophyRewardedToUser"|"trophyRewardedToAll"|undefined} event
     * @memberof Event
     * @instance
     */
    Object.defineProperty(Event.prototype, "event", {
        get: $util.oneOfGetter($oneOfFields = ["setRoomState", "classEnded", "userJoinedClass", "userLeftClass", "hostChanged", "contentChanged", "newChatMessage", "actvityStreamIdChanged", "trophyRewardedToUser", "trophyRewardedToAll"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Event instance using the specified properties.
     * @function create
     * @memberof Event
     * @static
     * @param {IEvent=} [properties] Properties to set
     * @returns {Event} Event instance
     */
    Event.create = function create(properties) {
        return new Event(properties);
    };

    /**
     * Encodes the specified Event message. Does not implicitly {@link Event.verify|verify} messages.
     * @function encode
     * @memberof Event
     * @static
     * @param {IEvent} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.setRoomState != null && Object.hasOwnProperty.call(message, "setRoomState"))
            $root.SetClassStateEvent.encode(message.setRoomState, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.classEnded != null && Object.hasOwnProperty.call(message, "classEnded"))
            $root.ClassEndedEvent.encode(message.classEnded, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.userJoinedClass != null && Object.hasOwnProperty.call(message, "userJoinedClass"))
            $root.UserJoinedClassEvent.encode(message.userJoinedClass, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.userLeftClass != null && Object.hasOwnProperty.call(message, "userLeftClass"))
            $root.UserLeftClassEvent.encode(message.userLeftClass, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.hostChanged != null && Object.hasOwnProperty.call(message, "hostChanged"))
            $root.HostChangedEvent.encode(message.hostChanged, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.contentChanged != null && Object.hasOwnProperty.call(message, "contentChanged"))
            $root.ContentChangedEvent.encode(message.contentChanged, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.newChatMessage != null && Object.hasOwnProperty.call(message, "newChatMessage"))
            $root.NewChatMessageEvent.encode(message.newChatMessage, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        if (message.actvityStreamIdChanged != null && Object.hasOwnProperty.call(message, "actvityStreamIdChanged"))
            $root.ActivityStreamIdChangedEvent.encode(message.actvityStreamIdChanged, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
        if (message.trophyRewardedToUser != null && Object.hasOwnProperty.call(message, "trophyRewardedToUser"))
            $root.TrophyRewardedToUserEvent.encode(message.trophyRewardedToUser, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
        if (message.trophyRewardedToAll != null && Object.hasOwnProperty.call(message, "trophyRewardedToAll"))
            $root.TrophyRewardedToAllEvent.encode(message.trophyRewardedToAll, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Event message, length delimited. Does not implicitly {@link Event.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Event
     * @static
     * @param {IEvent} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Event message from the specified reader or buffer.
     * @function decode
     * @memberof Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Event();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.setRoomState = $root.SetClassStateEvent.decode(reader, reader.uint32());
                break;
            case 3:
                message.classEnded = $root.ClassEndedEvent.decode(reader, reader.uint32());
                break;
            case 4:
                message.userJoinedClass = $root.UserJoinedClassEvent.decode(reader, reader.uint32());
                break;
            case 5:
                message.userLeftClass = $root.UserLeftClassEvent.decode(reader, reader.uint32());
                break;
            case 6:
                message.hostChanged = $root.HostChangedEvent.decode(reader, reader.uint32());
                break;
            case 7:
                message.contentChanged = $root.ContentChangedEvent.decode(reader, reader.uint32());
                break;
            case 8:
                message.newChatMessage = $root.NewChatMessageEvent.decode(reader, reader.uint32());
                break;
            case 9:
                message.actvityStreamIdChanged = $root.ActivityStreamIdChangedEvent.decode(reader, reader.uint32());
                break;
            case 10:
                message.trophyRewardedToUser = $root.TrophyRewardedToUserEvent.decode(reader, reader.uint32());
                break;
            case 11:
                message.trophyRewardedToAll = $root.TrophyRewardedToAllEvent.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Event message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Event message.
     * @function verify
     * @memberof Event
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Event.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.setRoomState != null && message.hasOwnProperty("setRoomState")) {
            properties.event = 1;
            {
                var error = $root.SetClassStateEvent.verify(message.setRoomState);
                if (error)
                    return "setRoomState." + error;
            }
        }
        if (message.classEnded != null && message.hasOwnProperty("classEnded")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                var error = $root.ClassEndedEvent.verify(message.classEnded);
                if (error)
                    return "classEnded." + error;
            }
        }
        if (message.userJoinedClass != null && message.hasOwnProperty("userJoinedClass")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                var error = $root.UserJoinedClassEvent.verify(message.userJoinedClass);
                if (error)
                    return "userJoinedClass." + error;
            }
        }
        if (message.userLeftClass != null && message.hasOwnProperty("userLeftClass")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                var error = $root.UserLeftClassEvent.verify(message.userLeftClass);
                if (error)
                    return "userLeftClass." + error;
            }
        }
        if (message.hostChanged != null && message.hasOwnProperty("hostChanged")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                var error = $root.HostChangedEvent.verify(message.hostChanged);
                if (error)
                    return "hostChanged." + error;
            }
        }
        if (message.contentChanged != null && message.hasOwnProperty("contentChanged")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                var error = $root.ContentChangedEvent.verify(message.contentChanged);
                if (error)
                    return "contentChanged." + error;
            }
        }
        if (message.newChatMessage != null && message.hasOwnProperty("newChatMessage")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                var error = $root.NewChatMessageEvent.verify(message.newChatMessage);
                if (error)
                    return "newChatMessage." + error;
            }
        }
        if (message.actvityStreamIdChanged != null && message.hasOwnProperty("actvityStreamIdChanged")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                var error = $root.ActivityStreamIdChangedEvent.verify(message.actvityStreamIdChanged);
                if (error)
                    return "actvityStreamIdChanged." + error;
            }
        }
        if (message.trophyRewardedToUser != null && message.hasOwnProperty("trophyRewardedToUser")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                var error = $root.TrophyRewardedToUserEvent.verify(message.trophyRewardedToUser);
                if (error)
                    return "trophyRewardedToUser." + error;
            }
        }
        if (message.trophyRewardedToAll != null && message.hasOwnProperty("trophyRewardedToAll")) {
            if (properties.event === 1)
                return "event: multiple values";
            properties.event = 1;
            {
                var error = $root.TrophyRewardedToAllEvent.verify(message.trophyRewardedToAll);
                if (error)
                    return "trophyRewardedToAll." + error;
            }
        }
        return null;
    };

    /**
     * Creates an Event message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Event
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Event} Event
     */
    Event.fromObject = function fromObject(object) {
        if (object instanceof $root.Event)
            return object;
        var message = new $root.Event();
        if (object.id != null)
            message.id = String(object.id);
        if (object.setRoomState != null) {
            if (typeof object.setRoomState !== "object")
                throw TypeError(".Event.setRoomState: object expected");
            message.setRoomState = $root.SetClassStateEvent.fromObject(object.setRoomState);
        }
        if (object.classEnded != null) {
            if (typeof object.classEnded !== "object")
                throw TypeError(".Event.classEnded: object expected");
            message.classEnded = $root.ClassEndedEvent.fromObject(object.classEnded);
        }
        if (object.userJoinedClass != null) {
            if (typeof object.userJoinedClass !== "object")
                throw TypeError(".Event.userJoinedClass: object expected");
            message.userJoinedClass = $root.UserJoinedClassEvent.fromObject(object.userJoinedClass);
        }
        if (object.userLeftClass != null) {
            if (typeof object.userLeftClass !== "object")
                throw TypeError(".Event.userLeftClass: object expected");
            message.userLeftClass = $root.UserLeftClassEvent.fromObject(object.userLeftClass);
        }
        if (object.hostChanged != null) {
            if (typeof object.hostChanged !== "object")
                throw TypeError(".Event.hostChanged: object expected");
            message.hostChanged = $root.HostChangedEvent.fromObject(object.hostChanged);
        }
        if (object.contentChanged != null) {
            if (typeof object.contentChanged !== "object")
                throw TypeError(".Event.contentChanged: object expected");
            message.contentChanged = $root.ContentChangedEvent.fromObject(object.contentChanged);
        }
        if (object.newChatMessage != null) {
            if (typeof object.newChatMessage !== "object")
                throw TypeError(".Event.newChatMessage: object expected");
            message.newChatMessage = $root.NewChatMessageEvent.fromObject(object.newChatMessage);
        }
        if (object.actvityStreamIdChanged != null) {
            if (typeof object.actvityStreamIdChanged !== "object")
                throw TypeError(".Event.actvityStreamIdChanged: object expected");
            message.actvityStreamIdChanged = $root.ActivityStreamIdChangedEvent.fromObject(object.actvityStreamIdChanged);
        }
        if (object.trophyRewardedToUser != null) {
            if (typeof object.trophyRewardedToUser !== "object")
                throw TypeError(".Event.trophyRewardedToUser: object expected");
            message.trophyRewardedToUser = $root.TrophyRewardedToUserEvent.fromObject(object.trophyRewardedToUser);
        }
        if (object.trophyRewardedToAll != null) {
            if (typeof object.trophyRewardedToAll !== "object")
                throw TypeError(".Event.trophyRewardedToAll: object expected");
            message.trophyRewardedToAll = $root.TrophyRewardedToAllEvent.fromObject(object.trophyRewardedToAll);
        }
        return message;
    };

    /**
     * Creates a plain object from an Event message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Event
     * @static
     * @param {Event} message Event
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Event.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.id = "";
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.setRoomState != null && message.hasOwnProperty("setRoomState")) {
            object.setRoomState = $root.SetClassStateEvent.toObject(message.setRoomState, options);
            if (options.oneofs)
                object.event = "setRoomState";
        }
        if (message.classEnded != null && message.hasOwnProperty("classEnded")) {
            object.classEnded = $root.ClassEndedEvent.toObject(message.classEnded, options);
            if (options.oneofs)
                object.event = "classEnded";
        }
        if (message.userJoinedClass != null && message.hasOwnProperty("userJoinedClass")) {
            object.userJoinedClass = $root.UserJoinedClassEvent.toObject(message.userJoinedClass, options);
            if (options.oneofs)
                object.event = "userJoinedClass";
        }
        if (message.userLeftClass != null && message.hasOwnProperty("userLeftClass")) {
            object.userLeftClass = $root.UserLeftClassEvent.toObject(message.userLeftClass, options);
            if (options.oneofs)
                object.event = "userLeftClass";
        }
        if (message.hostChanged != null && message.hasOwnProperty("hostChanged")) {
            object.hostChanged = $root.HostChangedEvent.toObject(message.hostChanged, options);
            if (options.oneofs)
                object.event = "hostChanged";
        }
        if (message.contentChanged != null && message.hasOwnProperty("contentChanged")) {
            object.contentChanged = $root.ContentChangedEvent.toObject(message.contentChanged, options);
            if (options.oneofs)
                object.event = "contentChanged";
        }
        if (message.newChatMessage != null && message.hasOwnProperty("newChatMessage")) {
            object.newChatMessage = $root.NewChatMessageEvent.toObject(message.newChatMessage, options);
            if (options.oneofs)
                object.event = "newChatMessage";
        }
        if (message.actvityStreamIdChanged != null && message.hasOwnProperty("actvityStreamIdChanged")) {
            object.actvityStreamIdChanged = $root.ActivityStreamIdChangedEvent.toObject(message.actvityStreamIdChanged, options);
            if (options.oneofs)
                object.event = "actvityStreamIdChanged";
        }
        if (message.trophyRewardedToUser != null && message.hasOwnProperty("trophyRewardedToUser")) {
            object.trophyRewardedToUser = $root.TrophyRewardedToUserEvent.toObject(message.trophyRewardedToUser, options);
            if (options.oneofs)
                object.event = "trophyRewardedToUser";
        }
        if (message.trophyRewardedToAll != null && message.hasOwnProperty("trophyRewardedToAll")) {
            object.trophyRewardedToAll = $root.TrophyRewardedToAllEvent.toObject(message.trophyRewardedToAll, options);
            if (options.oneofs)
                object.event = "trophyRewardedToAll";
        }
        return object;
    };

    /**
     * Converts this Event to JSON.
     * @function toJSON
     * @memberof Event
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Event.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Event;
})();

$root.EndClassCommand = (function() {

    /**
     * Properties of an EndClassCommand.
     * @exports IEndClassCommand
     * @interface IEndClassCommand
     */

    /**
     * Constructs a new EndClassCommand.
     * @exports EndClassCommand
     * @classdesc Represents an EndClassCommand.
     * @implements IEndClassCommand
     * @constructor
     * @param {IEndClassCommand=} [properties] Properties to set
     */
    function EndClassCommand(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new EndClassCommand instance using the specified properties.
     * @function create
     * @memberof EndClassCommand
     * @static
     * @param {IEndClassCommand=} [properties] Properties to set
     * @returns {EndClassCommand} EndClassCommand instance
     */
    EndClassCommand.create = function create(properties) {
        return new EndClassCommand(properties);
    };

    /**
     * Encodes the specified EndClassCommand message. Does not implicitly {@link EndClassCommand.verify|verify} messages.
     * @function encode
     * @memberof EndClassCommand
     * @static
     * @param {IEndClassCommand} message EndClassCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EndClassCommand.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        return writer;
    };

    /**
     * Encodes the specified EndClassCommand message, length delimited. Does not implicitly {@link EndClassCommand.verify|verify} messages.
     * @function encodeDelimited
     * @memberof EndClassCommand
     * @static
     * @param {IEndClassCommand} message EndClassCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EndClassCommand.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an EndClassCommand message from the specified reader or buffer.
     * @function decode
     * @memberof EndClassCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {EndClassCommand} EndClassCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EndClassCommand.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.EndClassCommand();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an EndClassCommand message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof EndClassCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {EndClassCommand} EndClassCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EndClassCommand.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an EndClassCommand message.
     * @function verify
     * @memberof EndClassCommand
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    EndClassCommand.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        return null;
    };

    /**
     * Creates an EndClassCommand message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof EndClassCommand
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {EndClassCommand} EndClassCommand
     */
    EndClassCommand.fromObject = function fromObject(object) {
        if (object instanceof $root.EndClassCommand)
            return object;
        return new $root.EndClassCommand();
    };

    /**
     * Creates a plain object from an EndClassCommand message. Also converts values to other types if specified.
     * @function toObject
     * @memberof EndClassCommand
     * @static
     * @param {EndClassCommand} message EndClassCommand
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    EndClassCommand.toObject = function toObject() {
        return {};
    };

    /**
     * Converts this EndClassCommand to JSON.
     * @function toJSON
     * @memberof EndClassCommand
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    EndClassCommand.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return EndClassCommand;
})();

$root.SetHostCommand = (function() {

    /**
     * Properties of a SetHostCommand.
     * @exports ISetHostCommand
     * @interface ISetHostCommand
     * @property {string|null} [hostUserId] SetHostCommand hostUserId
     */

    /**
     * Constructs a new SetHostCommand.
     * @exports SetHostCommand
     * @classdesc Represents a SetHostCommand.
     * @implements ISetHostCommand
     * @constructor
     * @param {ISetHostCommand=} [properties] Properties to set
     */
    function SetHostCommand(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SetHostCommand hostUserId.
     * @member {string} hostUserId
     * @memberof SetHostCommand
     * @instance
     */
    SetHostCommand.prototype.hostUserId = "";

    /**
     * Creates a new SetHostCommand instance using the specified properties.
     * @function create
     * @memberof SetHostCommand
     * @static
     * @param {ISetHostCommand=} [properties] Properties to set
     * @returns {SetHostCommand} SetHostCommand instance
     */
    SetHostCommand.create = function create(properties) {
        return new SetHostCommand(properties);
    };

    /**
     * Encodes the specified SetHostCommand message. Does not implicitly {@link SetHostCommand.verify|verify} messages.
     * @function encode
     * @memberof SetHostCommand
     * @static
     * @param {ISetHostCommand} message SetHostCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetHostCommand.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hostUserId != null && Object.hasOwnProperty.call(message, "hostUserId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.hostUserId);
        return writer;
    };

    /**
     * Encodes the specified SetHostCommand message, length delimited. Does not implicitly {@link SetHostCommand.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SetHostCommand
     * @static
     * @param {ISetHostCommand} message SetHostCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetHostCommand.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SetHostCommand message from the specified reader or buffer.
     * @function decode
     * @memberof SetHostCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SetHostCommand} SetHostCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetHostCommand.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SetHostCommand();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.hostUserId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SetHostCommand message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SetHostCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SetHostCommand} SetHostCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetHostCommand.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SetHostCommand message.
     * @function verify
     * @memberof SetHostCommand
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SetHostCommand.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hostUserId != null && message.hasOwnProperty("hostUserId"))
            if (!$util.isString(message.hostUserId))
                return "hostUserId: string expected";
        return null;
    };

    /**
     * Creates a SetHostCommand message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SetHostCommand
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SetHostCommand} SetHostCommand
     */
    SetHostCommand.fromObject = function fromObject(object) {
        if (object instanceof $root.SetHostCommand)
            return object;
        var message = new $root.SetHostCommand();
        if (object.hostUserId != null)
            message.hostUserId = String(object.hostUserId);
        return message;
    };

    /**
     * Creates a plain object from a SetHostCommand message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SetHostCommand
     * @static
     * @param {SetHostCommand} message SetHostCommand
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SetHostCommand.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.hostUserId = "";
        if (message.hostUserId != null && message.hasOwnProperty("hostUserId"))
            object.hostUserId = message.hostUserId;
        return object;
    };

    /**
     * Converts this SetHostCommand to JSON.
     * @function toJSON
     * @memberof SetHostCommand
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SetHostCommand.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SetHostCommand;
})();

$root.SetContentCommand = (function() {

    /**
     * Properties of a SetContentCommand.
     * @exports ISetContentCommand
     * @interface ISetContentCommand
     * @property {IContent|null} [content] SetContentCommand content
     */

    /**
     * Constructs a new SetContentCommand.
     * @exports SetContentCommand
     * @classdesc Represents a SetContentCommand.
     * @implements ISetContentCommand
     * @constructor
     * @param {ISetContentCommand=} [properties] Properties to set
     */
    function SetContentCommand(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SetContentCommand content.
     * @member {IContent|null|undefined} content
     * @memberof SetContentCommand
     * @instance
     */
    SetContentCommand.prototype.content = null;

    /**
     * Creates a new SetContentCommand instance using the specified properties.
     * @function create
     * @memberof SetContentCommand
     * @static
     * @param {ISetContentCommand=} [properties] Properties to set
     * @returns {SetContentCommand} SetContentCommand instance
     */
    SetContentCommand.create = function create(properties) {
        return new SetContentCommand(properties);
    };

    /**
     * Encodes the specified SetContentCommand message. Does not implicitly {@link SetContentCommand.verify|verify} messages.
     * @function encode
     * @memberof SetContentCommand
     * @static
     * @param {ISetContentCommand} message SetContentCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetContentCommand.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.content != null && Object.hasOwnProperty.call(message, "content"))
            $root.Content.encode(message.content, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified SetContentCommand message, length delimited. Does not implicitly {@link SetContentCommand.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SetContentCommand
     * @static
     * @param {ISetContentCommand} message SetContentCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetContentCommand.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SetContentCommand message from the specified reader or buffer.
     * @function decode
     * @memberof SetContentCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SetContentCommand} SetContentCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetContentCommand.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SetContentCommand();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.content = $root.Content.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SetContentCommand message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SetContentCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SetContentCommand} SetContentCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetContentCommand.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SetContentCommand message.
     * @function verify
     * @memberof SetContentCommand
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SetContentCommand.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.content != null && message.hasOwnProperty("content")) {
            var error = $root.Content.verify(message.content);
            if (error)
                return "content." + error;
        }
        return null;
    };

    /**
     * Creates a SetContentCommand message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SetContentCommand
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SetContentCommand} SetContentCommand
     */
    SetContentCommand.fromObject = function fromObject(object) {
        if (object instanceof $root.SetContentCommand)
            return object;
        var message = new $root.SetContentCommand();
        if (object.content != null) {
            if (typeof object.content !== "object")
                throw TypeError(".SetContentCommand.content: object expected");
            message.content = $root.Content.fromObject(object.content);
        }
        return message;
    };

    /**
     * Creates a plain object from a SetContentCommand message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SetContentCommand
     * @static
     * @param {SetContentCommand} message SetContentCommand
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SetContentCommand.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.content = null;
        if (message.content != null && message.hasOwnProperty("content"))
            object.content = $root.Content.toObject(message.content, options);
        return object;
    };

    /**
     * Converts this SetContentCommand to JSON.
     * @function toJSON
     * @memberof SetContentCommand
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SetContentCommand.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SetContentCommand;
})();

$root.SetActivityStreamIdCommand = (function() {

    /**
     * Properties of a SetActivityStreamIdCommand.
     * @exports ISetActivityStreamIdCommand
     * @interface ISetActivityStreamIdCommand
     * @property {string|null} [deviceId] SetActivityStreamIdCommand deviceId
     * @property {string|null} [activityStreamId] SetActivityStreamIdCommand activityStreamId
     */

    /**
     * Constructs a new SetActivityStreamIdCommand.
     * @exports SetActivityStreamIdCommand
     * @classdesc Represents a SetActivityStreamIdCommand.
     * @implements ISetActivityStreamIdCommand
     * @constructor
     * @param {ISetActivityStreamIdCommand=} [properties] Properties to set
     */
    function SetActivityStreamIdCommand(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SetActivityStreamIdCommand deviceId.
     * @member {string} deviceId
     * @memberof SetActivityStreamIdCommand
     * @instance
     */
    SetActivityStreamIdCommand.prototype.deviceId = "";

    /**
     * SetActivityStreamIdCommand activityStreamId.
     * @member {string} activityStreamId
     * @memberof SetActivityStreamIdCommand
     * @instance
     */
    SetActivityStreamIdCommand.prototype.activityStreamId = "";

    /**
     * Creates a new SetActivityStreamIdCommand instance using the specified properties.
     * @function create
     * @memberof SetActivityStreamIdCommand
     * @static
     * @param {ISetActivityStreamIdCommand=} [properties] Properties to set
     * @returns {SetActivityStreamIdCommand} SetActivityStreamIdCommand instance
     */
    SetActivityStreamIdCommand.create = function create(properties) {
        return new SetActivityStreamIdCommand(properties);
    };

    /**
     * Encodes the specified SetActivityStreamIdCommand message. Does not implicitly {@link SetActivityStreamIdCommand.verify|verify} messages.
     * @function encode
     * @memberof SetActivityStreamIdCommand
     * @static
     * @param {ISetActivityStreamIdCommand} message SetActivityStreamIdCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetActivityStreamIdCommand.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.deviceId);
        if (message.activityStreamId != null && Object.hasOwnProperty.call(message, "activityStreamId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.activityStreamId);
        return writer;
    };

    /**
     * Encodes the specified SetActivityStreamIdCommand message, length delimited. Does not implicitly {@link SetActivityStreamIdCommand.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SetActivityStreamIdCommand
     * @static
     * @param {ISetActivityStreamIdCommand} message SetActivityStreamIdCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetActivityStreamIdCommand.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SetActivityStreamIdCommand message from the specified reader or buffer.
     * @function decode
     * @memberof SetActivityStreamIdCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SetActivityStreamIdCommand} SetActivityStreamIdCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetActivityStreamIdCommand.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SetActivityStreamIdCommand();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.deviceId = reader.string();
                break;
            case 2:
                message.activityStreamId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SetActivityStreamIdCommand message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SetActivityStreamIdCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SetActivityStreamIdCommand} SetActivityStreamIdCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetActivityStreamIdCommand.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SetActivityStreamIdCommand message.
     * @function verify
     * @memberof SetActivityStreamIdCommand
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SetActivityStreamIdCommand.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.deviceId != null && message.hasOwnProperty("deviceId"))
            if (!$util.isString(message.deviceId))
                return "deviceId: string expected";
        if (message.activityStreamId != null && message.hasOwnProperty("activityStreamId"))
            if (!$util.isString(message.activityStreamId))
                return "activityStreamId: string expected";
        return null;
    };

    /**
     * Creates a SetActivityStreamIdCommand message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SetActivityStreamIdCommand
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SetActivityStreamIdCommand} SetActivityStreamIdCommand
     */
    SetActivityStreamIdCommand.fromObject = function fromObject(object) {
        if (object instanceof $root.SetActivityStreamIdCommand)
            return object;
        var message = new $root.SetActivityStreamIdCommand();
        if (object.deviceId != null)
            message.deviceId = String(object.deviceId);
        if (object.activityStreamId != null)
            message.activityStreamId = String(object.activityStreamId);
        return message;
    };

    /**
     * Creates a plain object from a SetActivityStreamIdCommand message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SetActivityStreamIdCommand
     * @static
     * @param {SetActivityStreamIdCommand} message SetActivityStreamIdCommand
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SetActivityStreamIdCommand.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.deviceId = "";
            object.activityStreamId = "";
        }
        if (message.deviceId != null && message.hasOwnProperty("deviceId"))
            object.deviceId = message.deviceId;
        if (message.activityStreamId != null && message.hasOwnProperty("activityStreamId"))
            object.activityStreamId = message.activityStreamId;
        return object;
    };

    /**
     * Converts this SetActivityStreamIdCommand to JSON.
     * @function toJSON
     * @memberof SetActivityStreamIdCommand
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SetActivityStreamIdCommand.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SetActivityStreamIdCommand;
})();

$root.RewardTrophyToUserCommand = (function() {

    /**
     * Properties of a RewardTrophyToUserCommand.
     * @exports IRewardTrophyToUserCommand
     * @interface IRewardTrophyToUserCommand
     * @property {string|null} [userId] RewardTrophyToUserCommand userId
     * @property {ITrophy|null} [trophy] RewardTrophyToUserCommand trophy
     */

    /**
     * Constructs a new RewardTrophyToUserCommand.
     * @exports RewardTrophyToUserCommand
     * @classdesc Represents a RewardTrophyToUserCommand.
     * @implements IRewardTrophyToUserCommand
     * @constructor
     * @param {IRewardTrophyToUserCommand=} [properties] Properties to set
     */
    function RewardTrophyToUserCommand(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RewardTrophyToUserCommand userId.
     * @member {string} userId
     * @memberof RewardTrophyToUserCommand
     * @instance
     */
    RewardTrophyToUserCommand.prototype.userId = "";

    /**
     * RewardTrophyToUserCommand trophy.
     * @member {ITrophy|null|undefined} trophy
     * @memberof RewardTrophyToUserCommand
     * @instance
     */
    RewardTrophyToUserCommand.prototype.trophy = null;

    /**
     * Creates a new RewardTrophyToUserCommand instance using the specified properties.
     * @function create
     * @memberof RewardTrophyToUserCommand
     * @static
     * @param {IRewardTrophyToUserCommand=} [properties] Properties to set
     * @returns {RewardTrophyToUserCommand} RewardTrophyToUserCommand instance
     */
    RewardTrophyToUserCommand.create = function create(properties) {
        return new RewardTrophyToUserCommand(properties);
    };

    /**
     * Encodes the specified RewardTrophyToUserCommand message. Does not implicitly {@link RewardTrophyToUserCommand.verify|verify} messages.
     * @function encode
     * @memberof RewardTrophyToUserCommand
     * @static
     * @param {IRewardTrophyToUserCommand} message RewardTrophyToUserCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RewardTrophyToUserCommand.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
        if (message.trophy != null && Object.hasOwnProperty.call(message, "trophy"))
            $root.Trophy.encode(message.trophy, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified RewardTrophyToUserCommand message, length delimited. Does not implicitly {@link RewardTrophyToUserCommand.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RewardTrophyToUserCommand
     * @static
     * @param {IRewardTrophyToUserCommand} message RewardTrophyToUserCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RewardTrophyToUserCommand.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RewardTrophyToUserCommand message from the specified reader or buffer.
     * @function decode
     * @memberof RewardTrophyToUserCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RewardTrophyToUserCommand} RewardTrophyToUserCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RewardTrophyToUserCommand.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RewardTrophyToUserCommand();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.userId = reader.string();
                break;
            case 2:
                message.trophy = $root.Trophy.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a RewardTrophyToUserCommand message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RewardTrophyToUserCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RewardTrophyToUserCommand} RewardTrophyToUserCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RewardTrophyToUserCommand.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RewardTrophyToUserCommand message.
     * @function verify
     * @memberof RewardTrophyToUserCommand
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RewardTrophyToUserCommand.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.userId != null && message.hasOwnProperty("userId"))
            if (!$util.isString(message.userId))
                return "userId: string expected";
        if (message.trophy != null && message.hasOwnProperty("trophy")) {
            var error = $root.Trophy.verify(message.trophy);
            if (error)
                return "trophy." + error;
        }
        return null;
    };

    /**
     * Creates a RewardTrophyToUserCommand message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RewardTrophyToUserCommand
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RewardTrophyToUserCommand} RewardTrophyToUserCommand
     */
    RewardTrophyToUserCommand.fromObject = function fromObject(object) {
        if (object instanceof $root.RewardTrophyToUserCommand)
            return object;
        var message = new $root.RewardTrophyToUserCommand();
        if (object.userId != null)
            message.userId = String(object.userId);
        if (object.trophy != null) {
            if (typeof object.trophy !== "object")
                throw TypeError(".RewardTrophyToUserCommand.trophy: object expected");
            message.trophy = $root.Trophy.fromObject(object.trophy);
        }
        return message;
    };

    /**
     * Creates a plain object from a RewardTrophyToUserCommand message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RewardTrophyToUserCommand
     * @static
     * @param {RewardTrophyToUserCommand} message RewardTrophyToUserCommand
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RewardTrophyToUserCommand.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.userId = "";
            object.trophy = null;
        }
        if (message.userId != null && message.hasOwnProperty("userId"))
            object.userId = message.userId;
        if (message.trophy != null && message.hasOwnProperty("trophy"))
            object.trophy = $root.Trophy.toObject(message.trophy, options);
        return object;
    };

    /**
     * Converts this RewardTrophyToUserCommand to JSON.
     * @function toJSON
     * @memberof RewardTrophyToUserCommand
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RewardTrophyToUserCommand.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RewardTrophyToUserCommand;
})();

$root.RewardTrophyToAllCommand = (function() {

    /**
     * Properties of a RewardTrophyToAllCommand.
     * @exports IRewardTrophyToAllCommand
     * @interface IRewardTrophyToAllCommand
     * @property {ITrophy|null} [trophy] RewardTrophyToAllCommand trophy
     */

    /**
     * Constructs a new RewardTrophyToAllCommand.
     * @exports RewardTrophyToAllCommand
     * @classdesc Represents a RewardTrophyToAllCommand.
     * @implements IRewardTrophyToAllCommand
     * @constructor
     * @param {IRewardTrophyToAllCommand=} [properties] Properties to set
     */
    function RewardTrophyToAllCommand(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * RewardTrophyToAllCommand trophy.
     * @member {ITrophy|null|undefined} trophy
     * @memberof RewardTrophyToAllCommand
     * @instance
     */
    RewardTrophyToAllCommand.prototype.trophy = null;

    /**
     * Creates a new RewardTrophyToAllCommand instance using the specified properties.
     * @function create
     * @memberof RewardTrophyToAllCommand
     * @static
     * @param {IRewardTrophyToAllCommand=} [properties] Properties to set
     * @returns {RewardTrophyToAllCommand} RewardTrophyToAllCommand instance
     */
    RewardTrophyToAllCommand.create = function create(properties) {
        return new RewardTrophyToAllCommand(properties);
    };

    /**
     * Encodes the specified RewardTrophyToAllCommand message. Does not implicitly {@link RewardTrophyToAllCommand.verify|verify} messages.
     * @function encode
     * @memberof RewardTrophyToAllCommand
     * @static
     * @param {IRewardTrophyToAllCommand} message RewardTrophyToAllCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RewardTrophyToAllCommand.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.trophy != null && Object.hasOwnProperty.call(message, "trophy"))
            $root.Trophy.encode(message.trophy, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified RewardTrophyToAllCommand message, length delimited. Does not implicitly {@link RewardTrophyToAllCommand.verify|verify} messages.
     * @function encodeDelimited
     * @memberof RewardTrophyToAllCommand
     * @static
     * @param {IRewardTrophyToAllCommand} message RewardTrophyToAllCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RewardTrophyToAllCommand.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RewardTrophyToAllCommand message from the specified reader or buffer.
     * @function decode
     * @memberof RewardTrophyToAllCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {RewardTrophyToAllCommand} RewardTrophyToAllCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RewardTrophyToAllCommand.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.RewardTrophyToAllCommand();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.trophy = $root.Trophy.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a RewardTrophyToAllCommand message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof RewardTrophyToAllCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {RewardTrophyToAllCommand} RewardTrophyToAllCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RewardTrophyToAllCommand.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RewardTrophyToAllCommand message.
     * @function verify
     * @memberof RewardTrophyToAllCommand
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RewardTrophyToAllCommand.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.trophy != null && message.hasOwnProperty("trophy")) {
            var error = $root.Trophy.verify(message.trophy);
            if (error)
                return "trophy." + error;
        }
        return null;
    };

    /**
     * Creates a RewardTrophyToAllCommand message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof RewardTrophyToAllCommand
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {RewardTrophyToAllCommand} RewardTrophyToAllCommand
     */
    RewardTrophyToAllCommand.fromObject = function fromObject(object) {
        if (object instanceof $root.RewardTrophyToAllCommand)
            return object;
        var message = new $root.RewardTrophyToAllCommand();
        if (object.trophy != null) {
            if (typeof object.trophy !== "object")
                throw TypeError(".RewardTrophyToAllCommand.trophy: object expected");
            message.trophy = $root.Trophy.fromObject(object.trophy);
        }
        return message;
    };

    /**
     * Creates a plain object from a RewardTrophyToAllCommand message. Also converts values to other types if specified.
     * @function toObject
     * @memberof RewardTrophyToAllCommand
     * @static
     * @param {RewardTrophyToAllCommand} message RewardTrophyToAllCommand
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RewardTrophyToAllCommand.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.trophy = null;
        if (message.trophy != null && message.hasOwnProperty("trophy"))
            object.trophy = $root.Trophy.toObject(message.trophy, options);
        return object;
    };

    /**
     * Converts this RewardTrophyToAllCommand to JSON.
     * @function toJSON
     * @memberof RewardTrophyToAllCommand
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RewardTrophyToAllCommand.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return RewardTrophyToAllCommand;
})();

$root.SendChatMessageCommand = (function() {

    /**
     * Properties of a SendChatMessageCommand.
     * @exports ISendChatMessageCommand
     * @interface ISendChatMessageCommand
     * @property {string|null} [message] SendChatMessageCommand message
     */

    /**
     * Constructs a new SendChatMessageCommand.
     * @exports SendChatMessageCommand
     * @classdesc Represents a SendChatMessageCommand.
     * @implements ISendChatMessageCommand
     * @constructor
     * @param {ISendChatMessageCommand=} [properties] Properties to set
     */
    function SendChatMessageCommand(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SendChatMessageCommand message.
     * @member {string} message
     * @memberof SendChatMessageCommand
     * @instance
     */
    SendChatMessageCommand.prototype.message = "";

    /**
     * Creates a new SendChatMessageCommand instance using the specified properties.
     * @function create
     * @memberof SendChatMessageCommand
     * @static
     * @param {ISendChatMessageCommand=} [properties] Properties to set
     * @returns {SendChatMessageCommand} SendChatMessageCommand instance
     */
    SendChatMessageCommand.create = function create(properties) {
        return new SendChatMessageCommand(properties);
    };

    /**
     * Encodes the specified SendChatMessageCommand message. Does not implicitly {@link SendChatMessageCommand.verify|verify} messages.
     * @function encode
     * @memberof SendChatMessageCommand
     * @static
     * @param {ISendChatMessageCommand} message SendChatMessageCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SendChatMessageCommand.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.message != null && Object.hasOwnProperty.call(message, "message"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
        return writer;
    };

    /**
     * Encodes the specified SendChatMessageCommand message, length delimited. Does not implicitly {@link SendChatMessageCommand.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SendChatMessageCommand
     * @static
     * @param {ISendChatMessageCommand} message SendChatMessageCommand message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SendChatMessageCommand.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SendChatMessageCommand message from the specified reader or buffer.
     * @function decode
     * @memberof SendChatMessageCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SendChatMessageCommand} SendChatMessageCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SendChatMessageCommand.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SendChatMessageCommand();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.message = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SendChatMessageCommand message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SendChatMessageCommand
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SendChatMessageCommand} SendChatMessageCommand
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SendChatMessageCommand.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SendChatMessageCommand message.
     * @function verify
     * @memberof SendChatMessageCommand
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SendChatMessageCommand.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.message != null && message.hasOwnProperty("message"))
            if (!$util.isString(message.message))
                return "message: string expected";
        return null;
    };

    /**
     * Creates a SendChatMessageCommand message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SendChatMessageCommand
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SendChatMessageCommand} SendChatMessageCommand
     */
    SendChatMessageCommand.fromObject = function fromObject(object) {
        if (object instanceof $root.SendChatMessageCommand)
            return object;
        var message = new $root.SendChatMessageCommand();
        if (object.message != null)
            message.message = String(object.message);
        return message;
    };

    /**
     * Creates a plain object from a SendChatMessageCommand message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SendChatMessageCommand
     * @static
     * @param {SendChatMessageCommand} message SendChatMessageCommand
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SendChatMessageCommand.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.message = "";
        if (message.message != null && message.hasOwnProperty("message"))
            object.message = message.message;
        return object;
    };

    /**
     * Converts this SendChatMessageCommand to JSON.
     * @function toJSON
     * @memberof SendChatMessageCommand
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SendChatMessageCommand.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SendChatMessageCommand;
})();

$root.SetClassStateEvent = (function() {

    /**
     * Properties of a SetClassStateEvent.
     * @exports ISetClassStateEvent
     * @interface ISetClassStateEvent
     * @property {IClassState|null} [state] SetClassStateEvent state
     */

    /**
     * Constructs a new SetClassStateEvent.
     * @exports SetClassStateEvent
     * @classdesc Represents a SetClassStateEvent.
     * @implements ISetClassStateEvent
     * @constructor
     * @param {ISetClassStateEvent=} [properties] Properties to set
     */
    function SetClassStateEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SetClassStateEvent state.
     * @member {IClassState|null|undefined} state
     * @memberof SetClassStateEvent
     * @instance
     */
    SetClassStateEvent.prototype.state = null;

    /**
     * Creates a new SetClassStateEvent instance using the specified properties.
     * @function create
     * @memberof SetClassStateEvent
     * @static
     * @param {ISetClassStateEvent=} [properties] Properties to set
     * @returns {SetClassStateEvent} SetClassStateEvent instance
     */
    SetClassStateEvent.create = function create(properties) {
        return new SetClassStateEvent(properties);
    };

    /**
     * Encodes the specified SetClassStateEvent message. Does not implicitly {@link SetClassStateEvent.verify|verify} messages.
     * @function encode
     * @memberof SetClassStateEvent
     * @static
     * @param {ISetClassStateEvent} message SetClassStateEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetClassStateEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.state != null && Object.hasOwnProperty.call(message, "state"))
            $root.ClassState.encode(message.state, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified SetClassStateEvent message, length delimited. Does not implicitly {@link SetClassStateEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SetClassStateEvent
     * @static
     * @param {ISetClassStateEvent} message SetClassStateEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SetClassStateEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SetClassStateEvent message from the specified reader or buffer.
     * @function decode
     * @memberof SetClassStateEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SetClassStateEvent} SetClassStateEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetClassStateEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SetClassStateEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.state = $root.ClassState.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SetClassStateEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SetClassStateEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SetClassStateEvent} SetClassStateEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SetClassStateEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SetClassStateEvent message.
     * @function verify
     * @memberof SetClassStateEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SetClassStateEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.state != null && message.hasOwnProperty("state")) {
            var error = $root.ClassState.verify(message.state);
            if (error)
                return "state." + error;
        }
        return null;
    };

    /**
     * Creates a SetClassStateEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SetClassStateEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SetClassStateEvent} SetClassStateEvent
     */
    SetClassStateEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.SetClassStateEvent)
            return object;
        var message = new $root.SetClassStateEvent();
        if (object.state != null) {
            if (typeof object.state !== "object")
                throw TypeError(".SetClassStateEvent.state: object expected");
            message.state = $root.ClassState.fromObject(object.state);
        }
        return message;
    };

    /**
     * Creates a plain object from a SetClassStateEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SetClassStateEvent
     * @static
     * @param {SetClassStateEvent} message SetClassStateEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SetClassStateEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.state = null;
        if (message.state != null && message.hasOwnProperty("state"))
            object.state = $root.ClassState.toObject(message.state, options);
        return object;
    };

    /**
     * Converts this SetClassStateEvent to JSON.
     * @function toJSON
     * @memberof SetClassStateEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SetClassStateEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SetClassStateEvent;
})();

$root.ClassEndedEvent = (function() {

    /**
     * Properties of a ClassEndedEvent.
     * @exports IClassEndedEvent
     * @interface IClassEndedEvent
     * @property {number|Long|null} [timestamp] ClassEndedEvent timestamp
     */

    /**
     * Constructs a new ClassEndedEvent.
     * @exports ClassEndedEvent
     * @classdesc Represents a ClassEndedEvent.
     * @implements IClassEndedEvent
     * @constructor
     * @param {IClassEndedEvent=} [properties] Properties to set
     */
    function ClassEndedEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClassEndedEvent timestamp.
     * @member {number|Long} timestamp
     * @memberof ClassEndedEvent
     * @instance
     */
    ClassEndedEvent.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new ClassEndedEvent instance using the specified properties.
     * @function create
     * @memberof ClassEndedEvent
     * @static
     * @param {IClassEndedEvent=} [properties] Properties to set
     * @returns {ClassEndedEvent} ClassEndedEvent instance
     */
    ClassEndedEvent.create = function create(properties) {
        return new ClassEndedEvent(properties);
    };

    /**
     * Encodes the specified ClassEndedEvent message. Does not implicitly {@link ClassEndedEvent.verify|verify} messages.
     * @function encode
     * @memberof ClassEndedEvent
     * @static
     * @param {IClassEndedEvent} message ClassEndedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClassEndedEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.timestamp);
        return writer;
    };

    /**
     * Encodes the specified ClassEndedEvent message, length delimited. Does not implicitly {@link ClassEndedEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClassEndedEvent
     * @static
     * @param {IClassEndedEvent} message ClassEndedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClassEndedEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClassEndedEvent message from the specified reader or buffer.
     * @function decode
     * @memberof ClassEndedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClassEndedEvent} ClassEndedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClassEndedEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClassEndedEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.timestamp = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ClassEndedEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClassEndedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClassEndedEvent} ClassEndedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClassEndedEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClassEndedEvent message.
     * @function verify
     * @memberof ClassEndedEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClassEndedEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                return "timestamp: integer|Long expected";
        return null;
    };

    /**
     * Creates a ClassEndedEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClassEndedEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClassEndedEvent} ClassEndedEvent
     */
    ClassEndedEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.ClassEndedEvent)
            return object;
        var message = new $root.ClassEndedEvent();
        if (object.timestamp != null)
            if ($util.Long)
                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
            else if (typeof object.timestamp === "string")
                message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
                message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a ClassEndedEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClassEndedEvent
     * @static
     * @param {ClassEndedEvent} message ClassEndedEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClassEndedEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timestamp = options.longs === String ? "0" : 0;
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
        return object;
    };

    /**
     * Converts this ClassEndedEvent to JSON.
     * @function toJSON
     * @memberof ClassEndedEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClassEndedEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ClassEndedEvent;
})();

$root.UserJoinedClassEvent = (function() {

    /**
     * Properties of a UserJoinedClassEvent.
     * @exports IUserJoinedClassEvent
     * @interface IUserJoinedClassEvent
     * @property {IUser|null} [user] UserJoinedClassEvent user
     * @property {IDevice|null} [device] UserJoinedClassEvent device
     */

    /**
     * Constructs a new UserJoinedClassEvent.
     * @exports UserJoinedClassEvent
     * @classdesc Represents a UserJoinedClassEvent.
     * @implements IUserJoinedClassEvent
     * @constructor
     * @param {IUserJoinedClassEvent=} [properties] Properties to set
     */
    function UserJoinedClassEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * UserJoinedClassEvent user.
     * @member {IUser|null|undefined} user
     * @memberof UserJoinedClassEvent
     * @instance
     */
    UserJoinedClassEvent.prototype.user = null;

    /**
     * UserJoinedClassEvent device.
     * @member {IDevice|null|undefined} device
     * @memberof UserJoinedClassEvent
     * @instance
     */
    UserJoinedClassEvent.prototype.device = null;

    /**
     * Creates a new UserJoinedClassEvent instance using the specified properties.
     * @function create
     * @memberof UserJoinedClassEvent
     * @static
     * @param {IUserJoinedClassEvent=} [properties] Properties to set
     * @returns {UserJoinedClassEvent} UserJoinedClassEvent instance
     */
    UserJoinedClassEvent.create = function create(properties) {
        return new UserJoinedClassEvent(properties);
    };

    /**
     * Encodes the specified UserJoinedClassEvent message. Does not implicitly {@link UserJoinedClassEvent.verify|verify} messages.
     * @function encode
     * @memberof UserJoinedClassEvent
     * @static
     * @param {IUserJoinedClassEvent} message UserJoinedClassEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserJoinedClassEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.user != null && Object.hasOwnProperty.call(message, "user"))
            $root.User.encode(message.user, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.device != null && Object.hasOwnProperty.call(message, "device"))
            $root.Device.encode(message.device, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified UserJoinedClassEvent message, length delimited. Does not implicitly {@link UserJoinedClassEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UserJoinedClassEvent
     * @static
     * @param {IUserJoinedClassEvent} message UserJoinedClassEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserJoinedClassEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a UserJoinedClassEvent message from the specified reader or buffer.
     * @function decode
     * @memberof UserJoinedClassEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UserJoinedClassEvent} UserJoinedClassEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserJoinedClassEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UserJoinedClassEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.user = $root.User.decode(reader, reader.uint32());
                break;
            case 2:
                message.device = $root.Device.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a UserJoinedClassEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UserJoinedClassEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UserJoinedClassEvent} UserJoinedClassEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserJoinedClassEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a UserJoinedClassEvent message.
     * @function verify
     * @memberof UserJoinedClassEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UserJoinedClassEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.user != null && message.hasOwnProperty("user")) {
            var error = $root.User.verify(message.user);
            if (error)
                return "user." + error;
        }
        if (message.device != null && message.hasOwnProperty("device")) {
            var error = $root.Device.verify(message.device);
            if (error)
                return "device." + error;
        }
        return null;
    };

    /**
     * Creates a UserJoinedClassEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UserJoinedClassEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UserJoinedClassEvent} UserJoinedClassEvent
     */
    UserJoinedClassEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.UserJoinedClassEvent)
            return object;
        var message = new $root.UserJoinedClassEvent();
        if (object.user != null) {
            if (typeof object.user !== "object")
                throw TypeError(".UserJoinedClassEvent.user: object expected");
            message.user = $root.User.fromObject(object.user);
        }
        if (object.device != null) {
            if (typeof object.device !== "object")
                throw TypeError(".UserJoinedClassEvent.device: object expected");
            message.device = $root.Device.fromObject(object.device);
        }
        return message;
    };

    /**
     * Creates a plain object from a UserJoinedClassEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UserJoinedClassEvent
     * @static
     * @param {UserJoinedClassEvent} message UserJoinedClassEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UserJoinedClassEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.user = null;
            object.device = null;
        }
        if (message.user != null && message.hasOwnProperty("user"))
            object.user = $root.User.toObject(message.user, options);
        if (message.device != null && message.hasOwnProperty("device"))
            object.device = $root.Device.toObject(message.device, options);
        return object;
    };

    /**
     * Converts this UserJoinedClassEvent to JSON.
     * @function toJSON
     * @memberof UserJoinedClassEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UserJoinedClassEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return UserJoinedClassEvent;
})();

$root.UserLeftClassEvent = (function() {

    /**
     * Properties of a UserLeftClassEvent.
     * @exports IUserLeftClassEvent
     * @interface IUserLeftClassEvent
     * @property {string|null} [userId] UserLeftClassEvent userId
     */

    /**
     * Constructs a new UserLeftClassEvent.
     * @exports UserLeftClassEvent
     * @classdesc Represents a UserLeftClassEvent.
     * @implements IUserLeftClassEvent
     * @constructor
     * @param {IUserLeftClassEvent=} [properties] Properties to set
     */
    function UserLeftClassEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * UserLeftClassEvent userId.
     * @member {string} userId
     * @memberof UserLeftClassEvent
     * @instance
     */
    UserLeftClassEvent.prototype.userId = "";

    /**
     * Creates a new UserLeftClassEvent instance using the specified properties.
     * @function create
     * @memberof UserLeftClassEvent
     * @static
     * @param {IUserLeftClassEvent=} [properties] Properties to set
     * @returns {UserLeftClassEvent} UserLeftClassEvent instance
     */
    UserLeftClassEvent.create = function create(properties) {
        return new UserLeftClassEvent(properties);
    };

    /**
     * Encodes the specified UserLeftClassEvent message. Does not implicitly {@link UserLeftClassEvent.verify|verify} messages.
     * @function encode
     * @memberof UserLeftClassEvent
     * @static
     * @param {IUserLeftClassEvent} message UserLeftClassEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserLeftClassEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
        return writer;
    };

    /**
     * Encodes the specified UserLeftClassEvent message, length delimited. Does not implicitly {@link UserLeftClassEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UserLeftClassEvent
     * @static
     * @param {IUserLeftClassEvent} message UserLeftClassEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserLeftClassEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a UserLeftClassEvent message from the specified reader or buffer.
     * @function decode
     * @memberof UserLeftClassEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UserLeftClassEvent} UserLeftClassEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserLeftClassEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.UserLeftClassEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.userId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a UserLeftClassEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UserLeftClassEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UserLeftClassEvent} UserLeftClassEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserLeftClassEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a UserLeftClassEvent message.
     * @function verify
     * @memberof UserLeftClassEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UserLeftClassEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.userId != null && message.hasOwnProperty("userId"))
            if (!$util.isString(message.userId))
                return "userId: string expected";
        return null;
    };

    /**
     * Creates a UserLeftClassEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UserLeftClassEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UserLeftClassEvent} UserLeftClassEvent
     */
    UserLeftClassEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.UserLeftClassEvent)
            return object;
        var message = new $root.UserLeftClassEvent();
        if (object.userId != null)
            message.userId = String(object.userId);
        return message;
    };

    /**
     * Creates a plain object from a UserLeftClassEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UserLeftClassEvent
     * @static
     * @param {UserLeftClassEvent} message UserLeftClassEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UserLeftClassEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.userId = "";
        if (message.userId != null && message.hasOwnProperty("userId"))
            object.userId = message.userId;
        return object;
    };

    /**
     * Converts this UserLeftClassEvent to JSON.
     * @function toJSON
     * @memberof UserLeftClassEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UserLeftClassEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return UserLeftClassEvent;
})();

$root.HostChangedEvent = (function() {

    /**
     * Properties of a HostChangedEvent.
     * @exports IHostChangedEvent
     * @interface IHostChangedEvent
     * @property {string|null} [hostUserId] HostChangedEvent hostUserId
     */

    /**
     * Constructs a new HostChangedEvent.
     * @exports HostChangedEvent
     * @classdesc Represents a HostChangedEvent.
     * @implements IHostChangedEvent
     * @constructor
     * @param {IHostChangedEvent=} [properties] Properties to set
     */
    function HostChangedEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * HostChangedEvent hostUserId.
     * @member {string} hostUserId
     * @memberof HostChangedEvent
     * @instance
     */
    HostChangedEvent.prototype.hostUserId = "";

    /**
     * Creates a new HostChangedEvent instance using the specified properties.
     * @function create
     * @memberof HostChangedEvent
     * @static
     * @param {IHostChangedEvent=} [properties] Properties to set
     * @returns {HostChangedEvent} HostChangedEvent instance
     */
    HostChangedEvent.create = function create(properties) {
        return new HostChangedEvent(properties);
    };

    /**
     * Encodes the specified HostChangedEvent message. Does not implicitly {@link HostChangedEvent.verify|verify} messages.
     * @function encode
     * @memberof HostChangedEvent
     * @static
     * @param {IHostChangedEvent} message HostChangedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HostChangedEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hostUserId != null && Object.hasOwnProperty.call(message, "hostUserId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.hostUserId);
        return writer;
    };

    /**
     * Encodes the specified HostChangedEvent message, length delimited. Does not implicitly {@link HostChangedEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof HostChangedEvent
     * @static
     * @param {IHostChangedEvent} message HostChangedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HostChangedEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a HostChangedEvent message from the specified reader or buffer.
     * @function decode
     * @memberof HostChangedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {HostChangedEvent} HostChangedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HostChangedEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.HostChangedEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.hostUserId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a HostChangedEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof HostChangedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {HostChangedEvent} HostChangedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HostChangedEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a HostChangedEvent message.
     * @function verify
     * @memberof HostChangedEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    HostChangedEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hostUserId != null && message.hasOwnProperty("hostUserId"))
            if (!$util.isString(message.hostUserId))
                return "hostUserId: string expected";
        return null;
    };

    /**
     * Creates a HostChangedEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof HostChangedEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {HostChangedEvent} HostChangedEvent
     */
    HostChangedEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.HostChangedEvent)
            return object;
        var message = new $root.HostChangedEvent();
        if (object.hostUserId != null)
            message.hostUserId = String(object.hostUserId);
        return message;
    };

    /**
     * Creates a plain object from a HostChangedEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof HostChangedEvent
     * @static
     * @param {HostChangedEvent} message HostChangedEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    HostChangedEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.hostUserId = "";
        if (message.hostUserId != null && message.hasOwnProperty("hostUserId"))
            object.hostUserId = message.hostUserId;
        return object;
    };

    /**
     * Converts this HostChangedEvent to JSON.
     * @function toJSON
     * @memberof HostChangedEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    HostChangedEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return HostChangedEvent;
})();

$root.ContentChangedEvent = (function() {

    /**
     * Properties of a ContentChangedEvent.
     * @exports IContentChangedEvent
     * @interface IContentChangedEvent
     * @property {IContent|null} [content] ContentChangedEvent content
     */

    /**
     * Constructs a new ContentChangedEvent.
     * @exports ContentChangedEvent
     * @classdesc Represents a ContentChangedEvent.
     * @implements IContentChangedEvent
     * @constructor
     * @param {IContentChangedEvent=} [properties] Properties to set
     */
    function ContentChangedEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ContentChangedEvent content.
     * @member {IContent|null|undefined} content
     * @memberof ContentChangedEvent
     * @instance
     */
    ContentChangedEvent.prototype.content = null;

    /**
     * Creates a new ContentChangedEvent instance using the specified properties.
     * @function create
     * @memberof ContentChangedEvent
     * @static
     * @param {IContentChangedEvent=} [properties] Properties to set
     * @returns {ContentChangedEvent} ContentChangedEvent instance
     */
    ContentChangedEvent.create = function create(properties) {
        return new ContentChangedEvent(properties);
    };

    /**
     * Encodes the specified ContentChangedEvent message. Does not implicitly {@link ContentChangedEvent.verify|verify} messages.
     * @function encode
     * @memberof ContentChangedEvent
     * @static
     * @param {IContentChangedEvent} message ContentChangedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ContentChangedEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.content != null && Object.hasOwnProperty.call(message, "content"))
            $root.Content.encode(message.content, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ContentChangedEvent message, length delimited. Does not implicitly {@link ContentChangedEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ContentChangedEvent
     * @static
     * @param {IContentChangedEvent} message ContentChangedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ContentChangedEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ContentChangedEvent message from the specified reader or buffer.
     * @function decode
     * @memberof ContentChangedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ContentChangedEvent} ContentChangedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ContentChangedEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ContentChangedEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.content = $root.Content.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ContentChangedEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ContentChangedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ContentChangedEvent} ContentChangedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ContentChangedEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ContentChangedEvent message.
     * @function verify
     * @memberof ContentChangedEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ContentChangedEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.content != null && message.hasOwnProperty("content")) {
            var error = $root.Content.verify(message.content);
            if (error)
                return "content." + error;
        }
        return null;
    };

    /**
     * Creates a ContentChangedEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ContentChangedEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ContentChangedEvent} ContentChangedEvent
     */
    ContentChangedEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.ContentChangedEvent)
            return object;
        var message = new $root.ContentChangedEvent();
        if (object.content != null) {
            if (typeof object.content !== "object")
                throw TypeError(".ContentChangedEvent.content: object expected");
            message.content = $root.Content.fromObject(object.content);
        }
        return message;
    };

    /**
     * Creates a plain object from a ContentChangedEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ContentChangedEvent
     * @static
     * @param {ContentChangedEvent} message ContentChangedEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ContentChangedEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.content = null;
        if (message.content != null && message.hasOwnProperty("content"))
            object.content = $root.Content.toObject(message.content, options);
        return object;
    };

    /**
     * Converts this ContentChangedEvent to JSON.
     * @function toJSON
     * @memberof ContentChangedEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ContentChangedEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ContentChangedEvent;
})();

$root.ActivityStreamIdChangedEvent = (function() {

    /**
     * Properties of an ActivityStreamIdChangedEvent.
     * @exports IActivityStreamIdChangedEvent
     * @interface IActivityStreamIdChangedEvent
     * @property {string|null} [deviceId] ActivityStreamIdChangedEvent deviceId
     * @property {string|null} [activityStreamId] ActivityStreamIdChangedEvent activityStreamId
     */

    /**
     * Constructs a new ActivityStreamIdChangedEvent.
     * @exports ActivityStreamIdChangedEvent
     * @classdesc Represents an ActivityStreamIdChangedEvent.
     * @implements IActivityStreamIdChangedEvent
     * @constructor
     * @param {IActivityStreamIdChangedEvent=} [properties] Properties to set
     */
    function ActivityStreamIdChangedEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ActivityStreamIdChangedEvent deviceId.
     * @member {string} deviceId
     * @memberof ActivityStreamIdChangedEvent
     * @instance
     */
    ActivityStreamIdChangedEvent.prototype.deviceId = "";

    /**
     * ActivityStreamIdChangedEvent activityStreamId.
     * @member {string} activityStreamId
     * @memberof ActivityStreamIdChangedEvent
     * @instance
     */
    ActivityStreamIdChangedEvent.prototype.activityStreamId = "";

    /**
     * Creates a new ActivityStreamIdChangedEvent instance using the specified properties.
     * @function create
     * @memberof ActivityStreamIdChangedEvent
     * @static
     * @param {IActivityStreamIdChangedEvent=} [properties] Properties to set
     * @returns {ActivityStreamIdChangedEvent} ActivityStreamIdChangedEvent instance
     */
    ActivityStreamIdChangedEvent.create = function create(properties) {
        return new ActivityStreamIdChangedEvent(properties);
    };

    /**
     * Encodes the specified ActivityStreamIdChangedEvent message. Does not implicitly {@link ActivityStreamIdChangedEvent.verify|verify} messages.
     * @function encode
     * @memberof ActivityStreamIdChangedEvent
     * @static
     * @param {IActivityStreamIdChangedEvent} message ActivityStreamIdChangedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ActivityStreamIdChangedEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.deviceId);
        if (message.activityStreamId != null && Object.hasOwnProperty.call(message, "activityStreamId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.activityStreamId);
        return writer;
    };

    /**
     * Encodes the specified ActivityStreamIdChangedEvent message, length delimited. Does not implicitly {@link ActivityStreamIdChangedEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ActivityStreamIdChangedEvent
     * @static
     * @param {IActivityStreamIdChangedEvent} message ActivityStreamIdChangedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ActivityStreamIdChangedEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ActivityStreamIdChangedEvent message from the specified reader or buffer.
     * @function decode
     * @memberof ActivityStreamIdChangedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ActivityStreamIdChangedEvent} ActivityStreamIdChangedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ActivityStreamIdChangedEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ActivityStreamIdChangedEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.deviceId = reader.string();
                break;
            case 2:
                message.activityStreamId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ActivityStreamIdChangedEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ActivityStreamIdChangedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ActivityStreamIdChangedEvent} ActivityStreamIdChangedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ActivityStreamIdChangedEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ActivityStreamIdChangedEvent message.
     * @function verify
     * @memberof ActivityStreamIdChangedEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ActivityStreamIdChangedEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.deviceId != null && message.hasOwnProperty("deviceId"))
            if (!$util.isString(message.deviceId))
                return "deviceId: string expected";
        if (message.activityStreamId != null && message.hasOwnProperty("activityStreamId"))
            if (!$util.isString(message.activityStreamId))
                return "activityStreamId: string expected";
        return null;
    };

    /**
     * Creates an ActivityStreamIdChangedEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ActivityStreamIdChangedEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ActivityStreamIdChangedEvent} ActivityStreamIdChangedEvent
     */
    ActivityStreamIdChangedEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.ActivityStreamIdChangedEvent)
            return object;
        var message = new $root.ActivityStreamIdChangedEvent();
        if (object.deviceId != null)
            message.deviceId = String(object.deviceId);
        if (object.activityStreamId != null)
            message.activityStreamId = String(object.activityStreamId);
        return message;
    };

    /**
     * Creates a plain object from an ActivityStreamIdChangedEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ActivityStreamIdChangedEvent
     * @static
     * @param {ActivityStreamIdChangedEvent} message ActivityStreamIdChangedEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ActivityStreamIdChangedEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.deviceId = "";
            object.activityStreamId = "";
        }
        if (message.deviceId != null && message.hasOwnProperty("deviceId"))
            object.deviceId = message.deviceId;
        if (message.activityStreamId != null && message.hasOwnProperty("activityStreamId"))
            object.activityStreamId = message.activityStreamId;
        return object;
    };

    /**
     * Converts this ActivityStreamIdChangedEvent to JSON.
     * @function toJSON
     * @memberof ActivityStreamIdChangedEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ActivityStreamIdChangedEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ActivityStreamIdChangedEvent;
})();

$root.TrophyRewardedToUserEvent = (function() {

    /**
     * Properties of a TrophyRewardedToUserEvent.
     * @exports ITrophyRewardedToUserEvent
     * @interface ITrophyRewardedToUserEvent
     * @property {string|null} [userId] TrophyRewardedToUserEvent userId
     * @property {ITrophy|null} [trophy] TrophyRewardedToUserEvent trophy
     */

    /**
     * Constructs a new TrophyRewardedToUserEvent.
     * @exports TrophyRewardedToUserEvent
     * @classdesc Represents a TrophyRewardedToUserEvent.
     * @implements ITrophyRewardedToUserEvent
     * @constructor
     * @param {ITrophyRewardedToUserEvent=} [properties] Properties to set
     */
    function TrophyRewardedToUserEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TrophyRewardedToUserEvent userId.
     * @member {string} userId
     * @memberof TrophyRewardedToUserEvent
     * @instance
     */
    TrophyRewardedToUserEvent.prototype.userId = "";

    /**
     * TrophyRewardedToUserEvent trophy.
     * @member {ITrophy|null|undefined} trophy
     * @memberof TrophyRewardedToUserEvent
     * @instance
     */
    TrophyRewardedToUserEvent.prototype.trophy = null;

    /**
     * Creates a new TrophyRewardedToUserEvent instance using the specified properties.
     * @function create
     * @memberof TrophyRewardedToUserEvent
     * @static
     * @param {ITrophyRewardedToUserEvent=} [properties] Properties to set
     * @returns {TrophyRewardedToUserEvent} TrophyRewardedToUserEvent instance
     */
    TrophyRewardedToUserEvent.create = function create(properties) {
        return new TrophyRewardedToUserEvent(properties);
    };

    /**
     * Encodes the specified TrophyRewardedToUserEvent message. Does not implicitly {@link TrophyRewardedToUserEvent.verify|verify} messages.
     * @function encode
     * @memberof TrophyRewardedToUserEvent
     * @static
     * @param {ITrophyRewardedToUserEvent} message TrophyRewardedToUserEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TrophyRewardedToUserEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
        if (message.trophy != null && Object.hasOwnProperty.call(message, "trophy"))
            $root.Trophy.encode(message.trophy, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified TrophyRewardedToUserEvent message, length delimited. Does not implicitly {@link TrophyRewardedToUserEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TrophyRewardedToUserEvent
     * @static
     * @param {ITrophyRewardedToUserEvent} message TrophyRewardedToUserEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TrophyRewardedToUserEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TrophyRewardedToUserEvent message from the specified reader or buffer.
     * @function decode
     * @memberof TrophyRewardedToUserEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TrophyRewardedToUserEvent} TrophyRewardedToUserEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TrophyRewardedToUserEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TrophyRewardedToUserEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.userId = reader.string();
                break;
            case 2:
                message.trophy = $root.Trophy.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TrophyRewardedToUserEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TrophyRewardedToUserEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TrophyRewardedToUserEvent} TrophyRewardedToUserEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TrophyRewardedToUserEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TrophyRewardedToUserEvent message.
     * @function verify
     * @memberof TrophyRewardedToUserEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TrophyRewardedToUserEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.userId != null && message.hasOwnProperty("userId"))
            if (!$util.isString(message.userId))
                return "userId: string expected";
        if (message.trophy != null && message.hasOwnProperty("trophy")) {
            var error = $root.Trophy.verify(message.trophy);
            if (error)
                return "trophy." + error;
        }
        return null;
    };

    /**
     * Creates a TrophyRewardedToUserEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TrophyRewardedToUserEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TrophyRewardedToUserEvent} TrophyRewardedToUserEvent
     */
    TrophyRewardedToUserEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.TrophyRewardedToUserEvent)
            return object;
        var message = new $root.TrophyRewardedToUserEvent();
        if (object.userId != null)
            message.userId = String(object.userId);
        if (object.trophy != null) {
            if (typeof object.trophy !== "object")
                throw TypeError(".TrophyRewardedToUserEvent.trophy: object expected");
            message.trophy = $root.Trophy.fromObject(object.trophy);
        }
        return message;
    };

    /**
     * Creates a plain object from a TrophyRewardedToUserEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TrophyRewardedToUserEvent
     * @static
     * @param {TrophyRewardedToUserEvent} message TrophyRewardedToUserEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TrophyRewardedToUserEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.userId = "";
            object.trophy = null;
        }
        if (message.userId != null && message.hasOwnProperty("userId"))
            object.userId = message.userId;
        if (message.trophy != null && message.hasOwnProperty("trophy"))
            object.trophy = $root.Trophy.toObject(message.trophy, options);
        return object;
    };

    /**
     * Converts this TrophyRewardedToUserEvent to JSON.
     * @function toJSON
     * @memberof TrophyRewardedToUserEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TrophyRewardedToUserEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TrophyRewardedToUserEvent;
})();

$root.TrophyRewardedToAllEvent = (function() {

    /**
     * Properties of a TrophyRewardedToAllEvent.
     * @exports ITrophyRewardedToAllEvent
     * @interface ITrophyRewardedToAllEvent
     * @property {ITrophy|null} [trophy] TrophyRewardedToAllEvent trophy
     */

    /**
     * Constructs a new TrophyRewardedToAllEvent.
     * @exports TrophyRewardedToAllEvent
     * @classdesc Represents a TrophyRewardedToAllEvent.
     * @implements ITrophyRewardedToAllEvent
     * @constructor
     * @param {ITrophyRewardedToAllEvent=} [properties] Properties to set
     */
    function TrophyRewardedToAllEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TrophyRewardedToAllEvent trophy.
     * @member {ITrophy|null|undefined} trophy
     * @memberof TrophyRewardedToAllEvent
     * @instance
     */
    TrophyRewardedToAllEvent.prototype.trophy = null;

    /**
     * Creates a new TrophyRewardedToAllEvent instance using the specified properties.
     * @function create
     * @memberof TrophyRewardedToAllEvent
     * @static
     * @param {ITrophyRewardedToAllEvent=} [properties] Properties to set
     * @returns {TrophyRewardedToAllEvent} TrophyRewardedToAllEvent instance
     */
    TrophyRewardedToAllEvent.create = function create(properties) {
        return new TrophyRewardedToAllEvent(properties);
    };

    /**
     * Encodes the specified TrophyRewardedToAllEvent message. Does not implicitly {@link TrophyRewardedToAllEvent.verify|verify} messages.
     * @function encode
     * @memberof TrophyRewardedToAllEvent
     * @static
     * @param {ITrophyRewardedToAllEvent} message TrophyRewardedToAllEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TrophyRewardedToAllEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.trophy != null && Object.hasOwnProperty.call(message, "trophy"))
            $root.Trophy.encode(message.trophy, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified TrophyRewardedToAllEvent message, length delimited. Does not implicitly {@link TrophyRewardedToAllEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TrophyRewardedToAllEvent
     * @static
     * @param {ITrophyRewardedToAllEvent} message TrophyRewardedToAllEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TrophyRewardedToAllEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TrophyRewardedToAllEvent message from the specified reader or buffer.
     * @function decode
     * @memberof TrophyRewardedToAllEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TrophyRewardedToAllEvent} TrophyRewardedToAllEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TrophyRewardedToAllEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TrophyRewardedToAllEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.trophy = $root.Trophy.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TrophyRewardedToAllEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TrophyRewardedToAllEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TrophyRewardedToAllEvent} TrophyRewardedToAllEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TrophyRewardedToAllEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TrophyRewardedToAllEvent message.
     * @function verify
     * @memberof TrophyRewardedToAllEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TrophyRewardedToAllEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.trophy != null && message.hasOwnProperty("trophy")) {
            var error = $root.Trophy.verify(message.trophy);
            if (error)
                return "trophy." + error;
        }
        return null;
    };

    /**
     * Creates a TrophyRewardedToAllEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TrophyRewardedToAllEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TrophyRewardedToAllEvent} TrophyRewardedToAllEvent
     */
    TrophyRewardedToAllEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.TrophyRewardedToAllEvent)
            return object;
        var message = new $root.TrophyRewardedToAllEvent();
        if (object.trophy != null) {
            if (typeof object.trophy !== "object")
                throw TypeError(".TrophyRewardedToAllEvent.trophy: object expected");
            message.trophy = $root.Trophy.fromObject(object.trophy);
        }
        return message;
    };

    /**
     * Creates a plain object from a TrophyRewardedToAllEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TrophyRewardedToAllEvent
     * @static
     * @param {TrophyRewardedToAllEvent} message TrophyRewardedToAllEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TrophyRewardedToAllEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.trophy = null;
        if (message.trophy != null && message.hasOwnProperty("trophy"))
            object.trophy = $root.Trophy.toObject(message.trophy, options);
        return object;
    };

    /**
     * Converts this TrophyRewardedToAllEvent to JSON.
     * @function toJSON
     * @memberof TrophyRewardedToAllEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TrophyRewardedToAllEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TrophyRewardedToAllEvent;
})();

$root.NewChatMessageEvent = (function() {

    /**
     * Properties of a NewChatMessageEvent.
     * @exports INewChatMessageEvent
     * @interface INewChatMessageEvent
     * @property {IChatMessage|null} [chatMessage] NewChatMessageEvent chatMessage
     */

    /**
     * Constructs a new NewChatMessageEvent.
     * @exports NewChatMessageEvent
     * @classdesc Represents a NewChatMessageEvent.
     * @implements INewChatMessageEvent
     * @constructor
     * @param {INewChatMessageEvent=} [properties] Properties to set
     */
    function NewChatMessageEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NewChatMessageEvent chatMessage.
     * @member {IChatMessage|null|undefined} chatMessage
     * @memberof NewChatMessageEvent
     * @instance
     */
    NewChatMessageEvent.prototype.chatMessage = null;

    /**
     * Creates a new NewChatMessageEvent instance using the specified properties.
     * @function create
     * @memberof NewChatMessageEvent
     * @static
     * @param {INewChatMessageEvent=} [properties] Properties to set
     * @returns {NewChatMessageEvent} NewChatMessageEvent instance
     */
    NewChatMessageEvent.create = function create(properties) {
        return new NewChatMessageEvent(properties);
    };

    /**
     * Encodes the specified NewChatMessageEvent message. Does not implicitly {@link NewChatMessageEvent.verify|verify} messages.
     * @function encode
     * @memberof NewChatMessageEvent
     * @static
     * @param {INewChatMessageEvent} message NewChatMessageEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewChatMessageEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.chatMessage != null && Object.hasOwnProperty.call(message, "chatMessage"))
            $root.ChatMessage.encode(message.chatMessage, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified NewChatMessageEvent message, length delimited. Does not implicitly {@link NewChatMessageEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NewChatMessageEvent
     * @static
     * @param {INewChatMessageEvent} message NewChatMessageEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewChatMessageEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NewChatMessageEvent message from the specified reader or buffer.
     * @function decode
     * @memberof NewChatMessageEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NewChatMessageEvent} NewChatMessageEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewChatMessageEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NewChatMessageEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.chatMessage = $root.ChatMessage.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NewChatMessageEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NewChatMessageEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NewChatMessageEvent} NewChatMessageEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewChatMessageEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NewChatMessageEvent message.
     * @function verify
     * @memberof NewChatMessageEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NewChatMessageEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.chatMessage != null && message.hasOwnProperty("chatMessage")) {
            var error = $root.ChatMessage.verify(message.chatMessage);
            if (error)
                return "chatMessage." + error;
        }
        return null;
    };

    /**
     * Creates a NewChatMessageEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NewChatMessageEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NewChatMessageEvent} NewChatMessageEvent
     */
    NewChatMessageEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.NewChatMessageEvent)
            return object;
        var message = new $root.NewChatMessageEvent();
        if (object.chatMessage != null) {
            if (typeof object.chatMessage !== "object")
                throw TypeError(".NewChatMessageEvent.chatMessage: object expected");
            message.chatMessage = $root.ChatMessage.fromObject(object.chatMessage);
        }
        return message;
    };

    /**
     * Creates a plain object from a NewChatMessageEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NewChatMessageEvent
     * @static
     * @param {NewChatMessageEvent} message NewChatMessageEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NewChatMessageEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.chatMessage = null;
        if (message.chatMessage != null && message.hasOwnProperty("chatMessage"))
            object.chatMessage = $root.ChatMessage.toObject(message.chatMessage, options);
        return object;
    };

    /**
     * Converts this NewChatMessageEvent to JSON.
     * @function toJSON
     * @memberof NewChatMessageEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NewChatMessageEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NewChatMessageEvent;
})();

$root.ClassState = (function() {

    /**
     * Properties of a ClassState.
     * @exports IClassState
     * @interface IClassState
     * @property {Object.<string,IUser>|null} [users] ClassState users
     * @property {Object.<string,IDevice>|null} [devices] ClassState devices
     * @property {Array.<IChatMessage>|null} [chatMessages] ClassState chatMessages
     * @property {IContent|null} [content] ClassState content
     * @property {string|null} [hostUserId] ClassState hostUserId
     * @property {number|Long|null} [classEndedTime] ClassState classEndedTime
     */

    /**
     * Constructs a new ClassState.
     * @exports ClassState
     * @classdesc Represents a ClassState.
     * @implements IClassState
     * @constructor
     * @param {IClassState=} [properties] Properties to set
     */
    function ClassState(properties) {
        this.users = {};
        this.devices = {};
        this.chatMessages = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClassState users.
     * @member {Object.<string,IUser>} users
     * @memberof ClassState
     * @instance
     */
    ClassState.prototype.users = $util.emptyObject;

    /**
     * ClassState devices.
     * @member {Object.<string,IDevice>} devices
     * @memberof ClassState
     * @instance
     */
    ClassState.prototype.devices = $util.emptyObject;

    /**
     * ClassState chatMessages.
     * @member {Array.<IChatMessage>} chatMessages
     * @memberof ClassState
     * @instance
     */
    ClassState.prototype.chatMessages = $util.emptyArray;

    /**
     * ClassState content.
     * @member {IContent|null|undefined} content
     * @memberof ClassState
     * @instance
     */
    ClassState.prototype.content = null;

    /**
     * ClassState hostUserId.
     * @member {string} hostUserId
     * @memberof ClassState
     * @instance
     */
    ClassState.prototype.hostUserId = "";

    /**
     * ClassState classEndedTime.
     * @member {number|Long} classEndedTime
     * @memberof ClassState
     * @instance
     */
    ClassState.prototype.classEndedTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new ClassState instance using the specified properties.
     * @function create
     * @memberof ClassState
     * @static
     * @param {IClassState=} [properties] Properties to set
     * @returns {ClassState} ClassState instance
     */
    ClassState.create = function create(properties) {
        return new ClassState(properties);
    };

    /**
     * Encodes the specified ClassState message. Does not implicitly {@link ClassState.verify|verify} messages.
     * @function encode
     * @memberof ClassState
     * @static
     * @param {IClassState} message ClassState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClassState.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.users != null && Object.hasOwnProperty.call(message, "users"))
            for (var keys = Object.keys(message.users), i = 0; i < keys.length; ++i) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                $root.User.encode(message.users[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
            }
        if (message.devices != null && Object.hasOwnProperty.call(message, "devices"))
            for (var keys = Object.keys(message.devices), i = 0; i < keys.length; ++i) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                $root.Device.encode(message.devices[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
            }
        if (message.chatMessages != null && message.chatMessages.length)
            for (var i = 0; i < message.chatMessages.length; ++i)
                $root.ChatMessage.encode(message.chatMessages[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.content != null && Object.hasOwnProperty.call(message, "content"))
            $root.Content.encode(message.content, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.hostUserId != null && Object.hasOwnProperty.call(message, "hostUserId"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.hostUserId);
        if (message.classEndedTime != null && Object.hasOwnProperty.call(message, "classEndedTime"))
            writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.classEndedTime);
        return writer;
    };

    /**
     * Encodes the specified ClassState message, length delimited. Does not implicitly {@link ClassState.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ClassState
     * @static
     * @param {IClassState} message ClassState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClassState.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClassState message from the specified reader or buffer.
     * @function decode
     * @memberof ClassState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ClassState} ClassState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClassState.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ClassState(), key, value;
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (message.users === $util.emptyObject)
                    message.users = {};
                var end2 = reader.uint32() + reader.pos;
                key = "";
                value = null;
                while (reader.pos < end2) {
                    var tag2 = reader.uint32();
                    switch (tag2 >>> 3) {
                    case 1:
                        key = reader.string();
                        break;
                    case 2:
                        value = $root.User.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag2 & 7);
                        break;
                    }
                }
                message.users[key] = value;
                break;
            case 2:
                if (message.devices === $util.emptyObject)
                    message.devices = {};
                var end2 = reader.uint32() + reader.pos;
                key = "";
                value = null;
                while (reader.pos < end2) {
                    var tag2 = reader.uint32();
                    switch (tag2 >>> 3) {
                    case 1:
                        key = reader.string();
                        break;
                    case 2:
                        value = $root.Device.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag2 & 7);
                        break;
                    }
                }
                message.devices[key] = value;
                break;
            case 3:
                if (!(message.chatMessages && message.chatMessages.length))
                    message.chatMessages = [];
                message.chatMessages.push($root.ChatMessage.decode(reader, reader.uint32()));
                break;
            case 4:
                message.content = $root.Content.decode(reader, reader.uint32());
                break;
            case 5:
                message.hostUserId = reader.string();
                break;
            case 6:
                message.classEndedTime = reader.uint64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ClassState message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ClassState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ClassState} ClassState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClassState.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClassState message.
     * @function verify
     * @memberof ClassState
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClassState.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.users != null && message.hasOwnProperty("users")) {
            if (!$util.isObject(message.users))
                return "users: object expected";
            var key = Object.keys(message.users);
            for (var i = 0; i < key.length; ++i) {
                var error = $root.User.verify(message.users[key[i]]);
                if (error)
                    return "users." + error;
            }
        }
        if (message.devices != null && message.hasOwnProperty("devices")) {
            if (!$util.isObject(message.devices))
                return "devices: object expected";
            var key = Object.keys(message.devices);
            for (var i = 0; i < key.length; ++i) {
                var error = $root.Device.verify(message.devices[key[i]]);
                if (error)
                    return "devices." + error;
            }
        }
        if (message.chatMessages != null && message.hasOwnProperty("chatMessages")) {
            if (!Array.isArray(message.chatMessages))
                return "chatMessages: array expected";
            for (var i = 0; i < message.chatMessages.length; ++i) {
                var error = $root.ChatMessage.verify(message.chatMessages[i]);
                if (error)
                    return "chatMessages." + error;
            }
        }
        if (message.content != null && message.hasOwnProperty("content")) {
            var error = $root.Content.verify(message.content);
            if (error)
                return "content." + error;
        }
        if (message.hostUserId != null && message.hasOwnProperty("hostUserId"))
            if (!$util.isString(message.hostUserId))
                return "hostUserId: string expected";
        if (message.classEndedTime != null && message.hasOwnProperty("classEndedTime"))
            if (!$util.isInteger(message.classEndedTime) && !(message.classEndedTime && $util.isInteger(message.classEndedTime.low) && $util.isInteger(message.classEndedTime.high)))
                return "classEndedTime: integer|Long expected";
        return null;
    };

    /**
     * Creates a ClassState message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ClassState
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ClassState} ClassState
     */
    ClassState.fromObject = function fromObject(object) {
        if (object instanceof $root.ClassState)
            return object;
        var message = new $root.ClassState();
        if (object.users) {
            if (typeof object.users !== "object")
                throw TypeError(".ClassState.users: object expected");
            message.users = {};
            for (var keys = Object.keys(object.users), i = 0; i < keys.length; ++i) {
                if (typeof object.users[keys[i]] !== "object")
                    throw TypeError(".ClassState.users: object expected");
                message.users[keys[i]] = $root.User.fromObject(object.users[keys[i]]);
            }
        }
        if (object.devices) {
            if (typeof object.devices !== "object")
                throw TypeError(".ClassState.devices: object expected");
            message.devices = {};
            for (var keys = Object.keys(object.devices), i = 0; i < keys.length; ++i) {
                if (typeof object.devices[keys[i]] !== "object")
                    throw TypeError(".ClassState.devices: object expected");
                message.devices[keys[i]] = $root.Device.fromObject(object.devices[keys[i]]);
            }
        }
        if (object.chatMessages) {
            if (!Array.isArray(object.chatMessages))
                throw TypeError(".ClassState.chatMessages: array expected");
            message.chatMessages = [];
            for (var i = 0; i < object.chatMessages.length; ++i) {
                if (typeof object.chatMessages[i] !== "object")
                    throw TypeError(".ClassState.chatMessages: object expected");
                message.chatMessages[i] = $root.ChatMessage.fromObject(object.chatMessages[i]);
            }
        }
        if (object.content != null) {
            if (typeof object.content !== "object")
                throw TypeError(".ClassState.content: object expected");
            message.content = $root.Content.fromObject(object.content);
        }
        if (object.hostUserId != null)
            message.hostUserId = String(object.hostUserId);
        if (object.classEndedTime != null)
            if ($util.Long)
                (message.classEndedTime = $util.Long.fromValue(object.classEndedTime)).unsigned = true;
            else if (typeof object.classEndedTime === "string")
                message.classEndedTime = parseInt(object.classEndedTime, 10);
            else if (typeof object.classEndedTime === "number")
                message.classEndedTime = object.classEndedTime;
            else if (typeof object.classEndedTime === "object")
                message.classEndedTime = new $util.LongBits(object.classEndedTime.low >>> 0, object.classEndedTime.high >>> 0).toNumber(true);
        return message;
    };

    /**
     * Creates a plain object from a ClassState message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ClassState
     * @static
     * @param {ClassState} message ClassState
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClassState.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.chatMessages = [];
        if (options.objects || options.defaults) {
            object.users = {};
            object.devices = {};
        }
        if (options.defaults) {
            object.content = null;
            object.hostUserId = "";
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.classEndedTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.classEndedTime = options.longs === String ? "0" : 0;
        }
        var keys2;
        if (message.users && (keys2 = Object.keys(message.users)).length) {
            object.users = {};
            for (var j = 0; j < keys2.length; ++j)
                object.users[keys2[j]] = $root.User.toObject(message.users[keys2[j]], options);
        }
        if (message.devices && (keys2 = Object.keys(message.devices)).length) {
            object.devices = {};
            for (var j = 0; j < keys2.length; ++j)
                object.devices[keys2[j]] = $root.Device.toObject(message.devices[keys2[j]], options);
        }
        if (message.chatMessages && message.chatMessages.length) {
            object.chatMessages = [];
            for (var j = 0; j < message.chatMessages.length; ++j)
                object.chatMessages[j] = $root.ChatMessage.toObject(message.chatMessages[j], options);
        }
        if (message.content != null && message.hasOwnProperty("content"))
            object.content = $root.Content.toObject(message.content, options);
        if (message.hostUserId != null && message.hasOwnProperty("hostUserId"))
            object.hostUserId = message.hostUserId;
        if (message.classEndedTime != null && message.hasOwnProperty("classEndedTime"))
            if (typeof message.classEndedTime === "number")
                object.classEndedTime = options.longs === String ? String(message.classEndedTime) : message.classEndedTime;
            else
                object.classEndedTime = options.longs === String ? $util.Long.prototype.toString.call(message.classEndedTime) : options.longs === Number ? new $util.LongBits(message.classEndedTime.low >>> 0, message.classEndedTime.high >>> 0).toNumber(true) : message.classEndedTime;
        return object;
    };

    /**
     * Converts this ClassState to JSON.
     * @function toJSON
     * @memberof ClassState
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClassState.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ClassState;
})();

$root.User = (function() {

    /**
     * Properties of a User.
     * @exports IUser
     * @interface IUser
     * @property {string|null} [id] User id
     * @property {string|null} [name] User name
     * @property {Array.<ITrophy>|null} [trophies] User trophies
     */

    /**
     * Constructs a new User.
     * @exports User
     * @classdesc Represents a User.
     * @implements IUser
     * @constructor
     * @param {IUser=} [properties] Properties to set
     */
    function User(properties) {
        this.trophies = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * User id.
     * @member {string} id
     * @memberof User
     * @instance
     */
    User.prototype.id = "";

    /**
     * User name.
     * @member {string} name
     * @memberof User
     * @instance
     */
    User.prototype.name = "";

    /**
     * User trophies.
     * @member {Array.<ITrophy>} trophies
     * @memberof User
     * @instance
     */
    User.prototype.trophies = $util.emptyArray;

    /**
     * Creates a new User instance using the specified properties.
     * @function create
     * @memberof User
     * @static
     * @param {IUser=} [properties] Properties to set
     * @returns {User} User instance
     */
    User.create = function create(properties) {
        return new User(properties);
    };

    /**
     * Encodes the specified User message. Does not implicitly {@link User.verify|verify} messages.
     * @function encode
     * @memberof User
     * @static
     * @param {IUser} message User message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    User.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        if (message.trophies != null && message.trophies.length)
            for (var i = 0; i < message.trophies.length; ++i)
                $root.Trophy.encode(message.trophies[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified User message, length delimited. Does not implicitly {@link User.verify|verify} messages.
     * @function encodeDelimited
     * @memberof User
     * @static
     * @param {IUser} message User message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    User.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a User message from the specified reader or buffer.
     * @function decode
     * @memberof User
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {User} User
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    User.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.User();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.name = reader.string();
                break;
            case 3:
                if (!(message.trophies && message.trophies.length))
                    message.trophies = [];
                message.trophies.push($root.Trophy.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a User message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof User
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {User} User
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    User.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a User message.
     * @function verify
     * @memberof User
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    User.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.trophies != null && message.hasOwnProperty("trophies")) {
            if (!Array.isArray(message.trophies))
                return "trophies: array expected";
            for (var i = 0; i < message.trophies.length; ++i) {
                var error = $root.Trophy.verify(message.trophies[i]);
                if (error)
                    return "trophies." + error;
            }
        }
        return null;
    };

    /**
     * Creates a User message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof User
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {User} User
     */
    User.fromObject = function fromObject(object) {
        if (object instanceof $root.User)
            return object;
        var message = new $root.User();
        if (object.id != null)
            message.id = String(object.id);
        if (object.name != null)
            message.name = String(object.name);
        if (object.trophies) {
            if (!Array.isArray(object.trophies))
                throw TypeError(".User.trophies: array expected");
            message.trophies = [];
            for (var i = 0; i < object.trophies.length; ++i) {
                if (typeof object.trophies[i] !== "object")
                    throw TypeError(".User.trophies: object expected");
                message.trophies[i] = $root.Trophy.fromObject(object.trophies[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a User message. Also converts values to other types if specified.
     * @function toObject
     * @memberof User
     * @static
     * @param {User} message User
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    User.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.trophies = [];
        if (options.defaults) {
            object.id = "";
            object.name = "";
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.trophies && message.trophies.length) {
            object.trophies = [];
            for (var j = 0; j < message.trophies.length; ++j)
                object.trophies[j] = $root.Trophy.toObject(message.trophies[j], options);
        }
        return object;
    };

    /**
     * Converts this User to JSON.
     * @function toJSON
     * @memberof User
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    User.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return User;
})();

$root.Trophy = (function() {

    /**
     * Properties of a Trophy.
     * @exports ITrophy
     * @interface ITrophy
     * @property {number|Long|null} [timestamp] Trophy timestamp
     * @property {string|null} [type] Trophy type
     */

    /**
     * Constructs a new Trophy.
     * @exports Trophy
     * @classdesc Represents a Trophy.
     * @implements ITrophy
     * @constructor
     * @param {ITrophy=} [properties] Properties to set
     */
    function Trophy(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Trophy timestamp.
     * @member {number|Long} timestamp
     * @memberof Trophy
     * @instance
     */
    Trophy.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Trophy type.
     * @member {string} type
     * @memberof Trophy
     * @instance
     */
    Trophy.prototype.type = "";

    /**
     * Creates a new Trophy instance using the specified properties.
     * @function create
     * @memberof Trophy
     * @static
     * @param {ITrophy=} [properties] Properties to set
     * @returns {Trophy} Trophy instance
     */
    Trophy.create = function create(properties) {
        return new Trophy(properties);
    };

    /**
     * Encodes the specified Trophy message. Does not implicitly {@link Trophy.verify|verify} messages.
     * @function encode
     * @memberof Trophy
     * @static
     * @param {ITrophy} message Trophy message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Trophy.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.timestamp);
        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
        return writer;
    };

    /**
     * Encodes the specified Trophy message, length delimited. Does not implicitly {@link Trophy.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Trophy
     * @static
     * @param {ITrophy} message Trophy message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Trophy.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Trophy message from the specified reader or buffer.
     * @function decode
     * @memberof Trophy
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Trophy} Trophy
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Trophy.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Trophy();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.timestamp = reader.uint64();
                break;
            case 2:
                message.type = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Trophy message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Trophy
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Trophy} Trophy
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Trophy.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Trophy message.
     * @function verify
     * @memberof Trophy
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Trophy.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                return "timestamp: integer|Long expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isString(message.type))
                return "type: string expected";
        return null;
    };

    /**
     * Creates a Trophy message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Trophy
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Trophy} Trophy
     */
    Trophy.fromObject = function fromObject(object) {
        if (object instanceof $root.Trophy)
            return object;
        var message = new $root.Trophy();
        if (object.timestamp != null)
            if ($util.Long)
                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
            else if (typeof object.timestamp === "string")
                message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
                message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
        if (object.type != null)
            message.type = String(object.type);
        return message;
    };

    /**
     * Creates a plain object from a Trophy message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Trophy
     * @static
     * @param {Trophy} message Trophy
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Trophy.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timestamp = options.longs === String ? "0" : 0;
            object.type = "";
        }
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        return object;
    };

    /**
     * Converts this Trophy to JSON.
     * @function toJSON
     * @memberof Trophy
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Trophy.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Trophy;
})();

$root.Device = (function() {

    /**
     * Properties of a Device.
     * @exports IDevice
     * @interface IDevice
     * @property {string|null} [id] Device id
     * @property {string|null} [activityStreamId] Device activityStreamId
     * @property {Array.<string>|null} [webRtcStreamIds] Device webRtcStreamIds
     */

    /**
     * Constructs a new Device.
     * @exports Device
     * @classdesc Represents a Device.
     * @implements IDevice
     * @constructor
     * @param {IDevice=} [properties] Properties to set
     */
    function Device(properties) {
        this.webRtcStreamIds = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Device id.
     * @member {string} id
     * @memberof Device
     * @instance
     */
    Device.prototype.id = "";

    /**
     * Device activityStreamId.
     * @member {string} activityStreamId
     * @memberof Device
     * @instance
     */
    Device.prototype.activityStreamId = "";

    /**
     * Device webRtcStreamIds.
     * @member {Array.<string>} webRtcStreamIds
     * @memberof Device
     * @instance
     */
    Device.prototype.webRtcStreamIds = $util.emptyArray;

    /**
     * Creates a new Device instance using the specified properties.
     * @function create
     * @memberof Device
     * @static
     * @param {IDevice=} [properties] Properties to set
     * @returns {Device} Device instance
     */
    Device.create = function create(properties) {
        return new Device(properties);
    };

    /**
     * Encodes the specified Device message. Does not implicitly {@link Device.verify|verify} messages.
     * @function encode
     * @memberof Device
     * @static
     * @param {IDevice} message Device message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Device.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.activityStreamId != null && Object.hasOwnProperty.call(message, "activityStreamId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.activityStreamId);
        if (message.webRtcStreamIds != null && message.webRtcStreamIds.length)
            for (var i = 0; i < message.webRtcStreamIds.length; ++i)
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.webRtcStreamIds[i]);
        return writer;
    };

    /**
     * Encodes the specified Device message, length delimited. Does not implicitly {@link Device.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Device
     * @static
     * @param {IDevice} message Device message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Device.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Device message from the specified reader or buffer.
     * @function decode
     * @memberof Device
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Device} Device
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Device.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Device();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.activityStreamId = reader.string();
                break;
            case 3:
                if (!(message.webRtcStreamIds && message.webRtcStreamIds.length))
                    message.webRtcStreamIds = [];
                message.webRtcStreamIds.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Device message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Device
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Device} Device
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Device.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Device message.
     * @function verify
     * @memberof Device
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Device.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.activityStreamId != null && message.hasOwnProperty("activityStreamId"))
            if (!$util.isString(message.activityStreamId))
                return "activityStreamId: string expected";
        if (message.webRtcStreamIds != null && message.hasOwnProperty("webRtcStreamIds")) {
            if (!Array.isArray(message.webRtcStreamIds))
                return "webRtcStreamIds: array expected";
            for (var i = 0; i < message.webRtcStreamIds.length; ++i)
                if (!$util.isString(message.webRtcStreamIds[i]))
                    return "webRtcStreamIds: string[] expected";
        }
        return null;
    };

    /**
     * Creates a Device message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Device
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Device} Device
     */
    Device.fromObject = function fromObject(object) {
        if (object instanceof $root.Device)
            return object;
        var message = new $root.Device();
        if (object.id != null)
            message.id = String(object.id);
        if (object.activityStreamId != null)
            message.activityStreamId = String(object.activityStreamId);
        if (object.webRtcStreamIds) {
            if (!Array.isArray(object.webRtcStreamIds))
                throw TypeError(".Device.webRtcStreamIds: array expected");
            message.webRtcStreamIds = [];
            for (var i = 0; i < object.webRtcStreamIds.length; ++i)
                message.webRtcStreamIds[i] = String(object.webRtcStreamIds[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a Device message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Device
     * @static
     * @param {Device} message Device
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Device.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.webRtcStreamIds = [];
        if (options.defaults) {
            object.id = "";
            object.activityStreamId = "";
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.activityStreamId != null && message.hasOwnProperty("activityStreamId"))
            object.activityStreamId = message.activityStreamId;
        if (message.webRtcStreamIds && message.webRtcStreamIds.length) {
            object.webRtcStreamIds = [];
            for (var j = 0; j < message.webRtcStreamIds.length; ++j)
                object.webRtcStreamIds[j] = message.webRtcStreamIds[j];
        }
        return object;
    };

    /**
     * Converts this Device to JSON.
     * @function toJSON
     * @memberof Device
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Device.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Device;
})();

$root.ChatMessage = (function() {

    /**
     * Properties of a ChatMessage.
     * @exports IChatMessage
     * @interface IChatMessage
     * @property {string|null} [userId] ChatMessage userId
     * @property {number|Long|null} [timestamp] ChatMessage timestamp
     * @property {Array.<ITrophy>|null} [trophies] ChatMessage trophies
     */

    /**
     * Constructs a new ChatMessage.
     * @exports ChatMessage
     * @classdesc Represents a ChatMessage.
     * @implements IChatMessage
     * @constructor
     * @param {IChatMessage=} [properties] Properties to set
     */
    function ChatMessage(properties) {
        this.trophies = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ChatMessage userId.
     * @member {string} userId
     * @memberof ChatMessage
     * @instance
     */
    ChatMessage.prototype.userId = "";

    /**
     * ChatMessage timestamp.
     * @member {number|Long} timestamp
     * @memberof ChatMessage
     * @instance
     */
    ChatMessage.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * ChatMessage trophies.
     * @member {Array.<ITrophy>} trophies
     * @memberof ChatMessage
     * @instance
     */
    ChatMessage.prototype.trophies = $util.emptyArray;

    /**
     * Creates a new ChatMessage instance using the specified properties.
     * @function create
     * @memberof ChatMessage
     * @static
     * @param {IChatMessage=} [properties] Properties to set
     * @returns {ChatMessage} ChatMessage instance
     */
    ChatMessage.create = function create(properties) {
        return new ChatMessage(properties);
    };

    /**
     * Encodes the specified ChatMessage message. Does not implicitly {@link ChatMessage.verify|verify} messages.
     * @function encode
     * @memberof ChatMessage
     * @static
     * @param {IChatMessage} message ChatMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.userId);
        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestamp);
        if (message.trophies != null && message.trophies.length)
            for (var i = 0; i < message.trophies.length; ++i)
                $root.Trophy.encode(message.trophies[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link ChatMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ChatMessage
     * @static
     * @param {IChatMessage} message ChatMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ChatMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ChatMessage message from the specified reader or buffer.
     * @function decode
     * @memberof ChatMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ChatMessage} ChatMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ChatMessage();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.userId = reader.string();
                break;
            case 2:
                message.timestamp = reader.uint64();
                break;
            case 3:
                if (!(message.trophies && message.trophies.length))
                    message.trophies = [];
                message.trophies.push($root.Trophy.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ChatMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ChatMessage} ChatMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ChatMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ChatMessage message.
     * @function verify
     * @memberof ChatMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ChatMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.userId != null && message.hasOwnProperty("userId"))
            if (!$util.isString(message.userId))
                return "userId: string expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                return "timestamp: integer|Long expected";
        if (message.trophies != null && message.hasOwnProperty("trophies")) {
            if (!Array.isArray(message.trophies))
                return "trophies: array expected";
            for (var i = 0; i < message.trophies.length; ++i) {
                var error = $root.Trophy.verify(message.trophies[i]);
                if (error)
                    return "trophies." + error;
            }
        }
        return null;
    };

    /**
     * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ChatMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ChatMessage} ChatMessage
     */
    ChatMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.ChatMessage)
            return object;
        var message = new $root.ChatMessage();
        if (object.userId != null)
            message.userId = String(object.userId);
        if (object.timestamp != null)
            if ($util.Long)
                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
            else if (typeof object.timestamp === "string")
                message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
                message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
        if (object.trophies) {
            if (!Array.isArray(object.trophies))
                throw TypeError(".ChatMessage.trophies: array expected");
            message.trophies = [];
            for (var i = 0; i < object.trophies.length; ++i) {
                if (typeof object.trophies[i] !== "object")
                    throw TypeError(".ChatMessage.trophies: object expected");
                message.trophies[i] = $root.Trophy.fromObject(object.trophies[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ChatMessage
     * @static
     * @param {ChatMessage} message ChatMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ChatMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.trophies = [];
        if (options.defaults) {
            object.userId = "";
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timestamp = options.longs === String ? "0" : 0;
        }
        if (message.userId != null && message.hasOwnProperty("userId"))
            object.userId = message.userId;
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
        if (message.trophies && message.trophies.length) {
            object.trophies = [];
            for (var j = 0; j < message.trophies.length; ++j)
                object.trophies[j] = $root.Trophy.toObject(message.trophies[j], options);
        }
        return object;
    };

    /**
     * Converts this ChatMessage to JSON.
     * @function toJSON
     * @memberof ChatMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ChatMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ChatMessage;
})();

$root.Content = (function() {

    /**
     * Properties of a Content.
     * @exports IContent
     * @interface IContent
     * @property {ContentType|null} [type] Content type
     * @property {string|null} [contentLocation] Content contentLocation
     */

    /**
     * Constructs a new Content.
     * @exports Content
     * @classdesc Represents a Content.
     * @implements IContent
     * @constructor
     * @param {IContent=} [properties] Properties to set
     */
    function Content(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Content type.
     * @member {ContentType} type
     * @memberof Content
     * @instance
     */
    Content.prototype.type = 0;

    /**
     * Content contentLocation.
     * @member {string} contentLocation
     * @memberof Content
     * @instance
     */
    Content.prototype.contentLocation = "";

    /**
     * Creates a new Content instance using the specified properties.
     * @function create
     * @memberof Content
     * @static
     * @param {IContent=} [properties] Properties to set
     * @returns {Content} Content instance
     */
    Content.create = function create(properties) {
        return new Content(properties);
    };

    /**
     * Encodes the specified Content message. Does not implicitly {@link Content.verify|verify} messages.
     * @function encode
     * @memberof Content
     * @static
     * @param {IContent} message Content message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Content.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
        if (message.contentLocation != null && Object.hasOwnProperty.call(message, "contentLocation"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.contentLocation);
        return writer;
    };

    /**
     * Encodes the specified Content message, length delimited. Does not implicitly {@link Content.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Content
     * @static
     * @param {IContent} message Content message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Content.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Content message from the specified reader or buffer.
     * @function decode
     * @memberof Content
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Content} Content
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Content.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Content();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.type = reader.int32();
                break;
            case 2:
                message.contentLocation = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Content message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Content
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Content} Content
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Content.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Content message.
     * @function verify
     * @memberof Content
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Content.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                break;
            }
        if (message.contentLocation != null && message.hasOwnProperty("contentLocation"))
            if (!$util.isString(message.contentLocation))
                return "contentLocation: string expected";
        return null;
    };

    /**
     * Creates a Content message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Content
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Content} Content
     */
    Content.fromObject = function fromObject(object) {
        if (object instanceof $root.Content)
            return object;
        var message = new $root.Content();
        switch (object.type) {
        case "Blank":
        case 0:
            message.type = 0;
            break;
        case "Stream":
        case 1:
            message.type = 1;
            break;
        case "Activity":
        case 2:
            message.type = 2;
            break;
        case "Video":
        case 3:
            message.type = 3;
            break;
        case "Audio":
        case 4:
            message.type = 4;
            break;
        case "Image":
        case 5:
            message.type = 5;
            break;
        case "Camera":
        case 6:
            message.type = 6;
            break;
        case "Screen":
        case 7:
            message.type = 7;
            break;
        }
        if (object.contentLocation != null)
            message.contentLocation = String(object.contentLocation);
        return message;
    };

    /**
     * Creates a plain object from a Content message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Content
     * @static
     * @param {Content} message Content
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Content.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.type = options.enums === String ? "Blank" : 0;
            object.contentLocation = "";
        }
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.ContentType[message.type] : message.type;
        if (message.contentLocation != null && message.hasOwnProperty("contentLocation"))
            object.contentLocation = message.contentLocation;
        return object;
    };

    /**
     * Converts this Content to JSON.
     * @function toJSON
     * @memberof Content
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Content.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Content;
})();

/**
 * ContentType enum.
 * @exports ContentType
 * @enum {number}
 * @property {number} Blank=0 Blank value
 * @property {number} Stream=1 Stream value
 * @property {number} Activity=2 Activity value
 * @property {number} Video=3 Video value
 * @property {number} Audio=4 Audio value
 * @property {number} Image=5 Image value
 * @property {number} Camera=6 Camera value
 * @property {number} Screen=7 Screen value
 */
$root.ContentType = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "Blank"] = 0;
    values[valuesById[1] = "Stream"] = 1;
    values[valuesById[2] = "Activity"] = 2;
    values[valuesById[3] = "Video"] = 3;
    values[valuesById[4] = "Audio"] = 4;
    values[valuesById[5] = "Image"] = 5;
    values[valuesById[6] = "Camera"] = 6;
    values[valuesById[7] = "Screen"] = 7;
    return values;
})();

module.exports = $root;