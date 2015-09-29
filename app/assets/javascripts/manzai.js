define(["require", "exports", "./collections", "./string"], function (require, exports, collections, string) {
    (function (Actor) {
        Actor[Actor["whole"] = 0] = "whole";
        Actor[Actor["boke"] = 1] = "boke";
        Actor[Actor["tsukkomi"] = 2] = "tsukkomi";
    })(exports.Actor || (exports.Actor = {}));
    var Actor = exports.Actor;
    (function (Action) {
        Action[Action["message"] = 0] = "message";
        Action[Action["bokeru"] = 1] = "bokeru";
        Action[Action["tsukkomu"] = 2] = "tsukkomu";
    })(exports.Action || (exports.Action = {}));
    var Action = exports.Action;
    var Timeline = (function () {
        function Timeline(script) {
            var _this = this;
            this.script = script;
            this.queue = new collections.Queue();
            for (var i = 0; i < this.script.sentences.length; i++) {
                this.queue.enqueue(this.script.sentences[i]);
            }
            this.game = new enchant.Game(320, 320);
            this.game.preload(["/assets/stage.jpg", "/assets/0124.gif", "/assets/0125.gif", "/assets/balloon.png"]);
            this.game.onload = function () {
                var background = new enchant.Sprite(320, 320);
                background.image = _this.game.assets["/assets/stage.jpg"];
                background.x = 0;
                background.y = 0;
                _this.game.rootScene.addChild(background);
                _this.tsukkomi = new enchant.Sprite(35, 53);
                _this.tsukkomi.image = _this.game.assets["/assets/0124.gif"];
                _this.tsukkomi.x = 160 - _this.tsukkomi.width - 15;
                _this.tsukkomi.y = 195;
                _this.game.rootScene.addChild(_this.tsukkomi);
                _this.boke = new enchant.Sprite(43, 49);
                _this.boke.image = _this.game.assets["/assets/0125.gif"];
                _this.boke.x = 160 + 10;
                _this.boke.y = 200;
                _this.game.rootScene.addChild(_this.boke);
            };
            this.game.start();
        }
        Object.defineProperty(Timeline.prototype, "title", {
            get: function () {
                return this.script.title;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timeline.prototype, "playing", {
            get: function () {
                return 0 < this.queue.size;
            },
            enumerable: true,
            configurable: true
        });
        Timeline.prototype.play = function () {
            var _this = this;
            var sentence = this.queue.dequeue();
            if (!sentence)
                return;
            var scaleY = 0.5;
            var scaleX = 0.9;
            switch (sentence.actor) {
                case 1:
                    switch (sentence.action) {
                        case 1:
                            var counter = 1;
                            var timerId = setInterval(function () {
                                _this.boke.scaleX *= -1;
                                if (10 <= counter) {
                                    clearInterval(timerId);
                                }
                                counter++;
                            }, 100);
                            break;
                    }
                    break;
                case 2:
                    scaleX *= -1;
                    switch (sentence.action) {
                        case 2:
                            var defaultX = 160 - this.tsukkomi.width - 15;
                            var defaultY = 195;
                            this.tsukkomi.tl.moveTo(defaultX + 10, defaultY, 10, enchant.Easing.QUAD_EASEINOUT);
                            var counter = 1;
                            var timerId = setInterval(function () {
                                _this.tsukkomi.scaleX *= -1;
                                if (10 <= counter) {
                                    _this.tsukkomi.tl.moveTo(defaultX, defaultY, 10, enchant.Easing.QUAD_EASEINOUT);
                                    clearInterval(timerId);
                                }
                                counter++;
                            }, 100);
                            break;
                    }
                    break;
            }
            this.game.rootScene.removeChild(this.balloon);
            this.balloon = new enchant.Group();
            this.balloon.x = 0;
            this.balloon.y = 0;
            var sprite = new enchant.Sprite(300, 233);
            sprite.x = 0;
            sprite.y = 0;
            sprite.image = this.game.assets["/assets/balloon.png"];
            sprite.scale(scaleX, scaleY);
            this.balloon.addChild(sprite);
            var label = new enchant.Label(this.adjust(sentence.message));
            label.x = 50;
            label.y = 85;
            this.balloon.addChild(label);
            this.game.rootScene.addChild(this.balloon);
        };
        Timeline.prototype.end = function () {
            this.game.rootScene.removeChild(this.balloon);
            this.balloon = new enchant.Group();
            this.balloon.x = 0;
            this.balloon.y = 0;
            var sprite = new enchant.Sprite(300, 233);
            sprite.x = 0;
            sprite.y = 0;
            sprite.image = this.game.assets["/assets/balloon.png"];
            sprite.scale(0.9, 0.5);
            this.balloon.addChild(sprite);
            var label = new enchant.Label(this.adjust("ありがとうございましたー"));
            label.x = 50;
            label.y = 85;
            this.balloon.addChild(label);
            this.game.rootScene.addChild(this.balloon);
        };
        Timeline.prototype.adjust = function (message) {
            message = message.replace((new RegExp("\r\n", "g")), "");
            message = message.replace((new RegExp("\n", "g")), "");
            var sb = new string.StringBuffer(message);
            var p = 0;
            var maxLineLength = 15;
            var insertText = "<br>";
            while (p < sb.length) {
                p += maxLineLength;
                if (message.indexOf(sb.toString()[p], 0) > -1)
                    p++;
                sb.insert(p, insertText);
                p += insertText.length;
            }
            return sb.toString();
        };
        return Timeline;
    })();
    exports.Timeline = Timeline;
});
