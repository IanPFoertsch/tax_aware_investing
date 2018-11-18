function DOMElement(config, parentIdentifier) {
  this.config = config;
  this.parentIdentifier = parentIdentifier;
  this.identifier = '.' + config.cssClasses;
  this.classes = this.config.cssClasses;
}

DOMElement.prototype.prepare = function() {
  var parent = document.querySelector(this.parentIdentifier);
  this.element = document.createElement(this.type);

  _.each(this.classes, (cssClass) => {
    this.element.classList.add(cssClass);
  });

  //This should possibly be called manually later in order to preserve
  //ordering
  parent.appendChild(this.element);
  if (typeof this.prepareChildren === "function") {
    this.prepareChildren();
  }
};
