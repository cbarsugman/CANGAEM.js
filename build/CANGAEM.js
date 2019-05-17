var CANGAEM;
(function (CANGAEM) {
    class Object {
        constructor() {
            this.worldPosition = new Vector2(0, 0);
            this.position = new Vector2(0, 0);
            this.velocity = new Vector2(0, 0);
            this.children = [];
        }
        ObjectHandler() {
            if (!(this instanceof Origin)) {
                this.Update();
                this.position.x += this.velocity.x * this.deltaTime;
                this.position.y += this.velocity.y * this.deltaTime;
                this.worldPosition.x = this.parent.worldPosition.x + this.position.x;
                this.worldPosition.y = this.parent.worldPosition.y + this.position.y;
            }
            this.Draw();
            this.children.forEach(child => {
                child.inputHelper = this.inputHelper;
                child.deltaTime = this.deltaTime;
                child.ObjectHandler();
            });
        }
        Update() {
        }
        Draw() {
        }
        DistanceVector2(other) {
            return new Vector2(this.worldPosition.x - other.worldPosition.x, this.worldPosition.y - other.worldPosition.y);
        }
        Add(object) {
            this.children.push(object);
            object.parent = this;
            object.context = this.context;
            object.inputHelper = this.inputHelper;
        }
    }
    CANGAEM.Object = Object;
    class ScreenSpaceObject extends Object {
        constructor() {
            super();
            this.size = new Vector2(0, 0);
            this.origin = new Vector2(0, 0);
        }
        CollidesWith(other) {
            return (this.position.x - this.origin.x < other.position.x - other.origin.x + other.size.x &&
                this.position.x - this.origin.x + this.size.x > other.position.x - other.origin.x &&
                this.position.y - this.origin.y < other.position.y - other.origin.y + other.size.y &&
                this.position.y - this.origin.y + this.size.y > other.position.y - other.origin.y);
        }
        Center() {
            return new Vector2(this.size.x / 2, this.size.y / 2);
        }
        DistanceVector2(other) {
            return new Vector2(this.worldPosition.x - this.size.x / 2 - other.worldPosition.x, this.worldPosition.y - this.size.y / 2 - other.worldPosition.y);
        }
    }
    CANGAEM.ScreenSpaceObject = ScreenSpaceObject;
    class ImageObject extends ScreenSpaceObject {
        constructor(src = "defaulticon.png") {
            super();
            this.image = document.createElement("img");
            this.image.setAttribute("src", src);
            this.image.onload = () => {
                this.size.x = this.image.width;
                this.size.y = this.image.height;
            };
        }
        Draw() {
            this.context.drawImage(this.image, this.worldPosition.x - this.origin.x, this.worldPosition.y - this.origin.x);
        }
    }
    CANGAEM.ImageObject = ImageObject;
    class RectObject extends ScreenSpaceObject {
        constructor(size) {
            super();
            this.fillColor = "black";
            this.strokeColor = "black";
            this.strokeWidth = 0;
            this.size = size;
        }
        Draw() {
            this.context.fillStyle = this.fillColor;
            this.context.fillRect(this.worldPosition.x - this.origin.x, this.worldPosition.y - this.origin.y, this.size.x, this.size.y);
            this.context.strokeStyle = this.strokeColor;
            this.context.lineWidth = this.strokeWidth;
            this.context.strokeRect(this.worldPosition.x - this.origin.x, this.worldPosition.y - this.origin.y, this.size.x, this.size.y);
        }
    }
    CANGAEM.RectObject = RectObject;
    class Origin extends Object {
        constructor(id = "CANGAEM") {
            super();
            this.parent = this;
            this.inputHelper = new InputHelper();
            this.element = document.getElementById(id);
            if (!document.body.contains(this.element)) {
                this.element = document.createElement("canvas");
                this.element.setAttribute("id", "CANGAEM_Canvas");
                document.body.appendChild(this.element);
            }
            this.canvas = this.element;
            this.context = this.canvas.getContext("2d");
            this.lastupdate = Date.now();
        }
        Update() {
            //calc deltatime
            let now = Date.now();
            this.deltaTime = Date.now() - this.lastupdate;
            this.lastupdate = now;
            this.canvas.width = this.element.clientWidth;
            this.canvas.height = this.element.clientHeight;
            this.inputHelper.Update();
            //clear canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.position.x += this.velocity.x * this.deltaTime;
            this.position.y += this.velocity.y * this.deltaTime;
            this.worldPosition = this.position;
            this.worldPosition = this.position;
            super.ObjectHandler();
        }
        ScreenCenter() {
            return new Vector2(this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    CANGAEM.Origin = Origin;
    class Vector2 {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        Lenght() {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        }
        Normalized() {
            let len = this.Lenght();
            return new Vector2(this.x / len, this.y / len);
        }
    }
    CANGAEM.Vector2 = Vector2;
    class InputHelper {
        constructor() {
            this.keys = [];
            document.addEventListener("keydown", (event) => {
                if (typeof this.keys[event.keyCode] == "undefined") {
                    this.keys[event.keyCode] = [true, 0];
                }
                else {
                    this.keys[event.keyCode][0] = true;
                }
            });
            document.addEventListener("keyup", (event) => {
                this.keys[event.keyCode] = [false, 0];
            });
        }
        Update() {
            this.keys.forEach(key => {
                if (key[0]) {
                    key[1] += 1;
                }
            });
        }
        KeyDown(keyCode) {
            if (typeof this.keys[keyCode] != "undefined" && this.keys[keyCode][0]) {
                return true;
            }
            else {
                return false;
            }
        }
        KeyPressed(keyCode) {
            if (typeof this.keys[keyCode] != "undefined" && this.keys[keyCode][0] && this.keys[keyCode][1] == 1) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    CANGAEM.InputHelper = InputHelper;
})(CANGAEM || (CANGAEM = {}));
