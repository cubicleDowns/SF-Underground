export class HUDGroup{

    constructor(name, hudsystem) {
        this.hudsystem = hudsystem;
        this.name = name;
        this.elements = [];
        this.hudsystem.groups.push(this);
    };

    setVisible(bool) {
        this.elements.forEach(function(e) {
            e.setVisible(bool);
        });
    };

    add(guiElement) {
        this.elements.push(guiElement);
    };

    dispose() {
        this.elements.forEach(function(e) {
          e.dispose();
        });
        this.elements = [];
    };

    isVisible() {
      return (this.elements.length != 0)? this.elements[0].mesh.isVisible : false;
    };


}
