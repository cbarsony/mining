const draw2d = window.draw2d
const $ = window.$

const SelectionMenuPolicy = draw2d.policy.figure.SelectionPolicy.extend({
  NAME: 'SelectionMenuPolicy',
  init: function(attr, setter, getter) {
    this.overlay = null
    this._super(attr, setter, getter)
  },
  onSelect: function(canvas, figure, isPrimarySelection) {
    this._super(canvas, figure, isPrimarySelection)

    if (this.overlay === null) {
      this.overlay = $('#my_overlay')
      $('#canvas').append(this.overlay)
    }
    this.posOverlay(figure);
  },
  onUnselect: function(canvas, figure )
  {
    const self = this

    self._super(canvas, figure);

    setTimeout(function() {
      // self.overlay.remove();
      self.overlay.css({display: 'none'})
      $('body').append(self.overlay)
      self.overlay=null;
    }, 0)
  },
  onDrag: function(canvas, figure)
  {
    this._super(canvas, figure);
    this.posOverlay(figure);
  },

  posOverlay: function(figure)
  {
    this.overlay.css({
      "top":figure.getAbsoluteY()-20,
      "left":figure.getAbsoluteX()+ figure.getWidth()+40,
      "z-index": 1000,
      display: 'block',
    });
  }
})

export const type = {
  bin: draw2d.SVGFigure.extend({
    NAME: "Bin",
    init : function()
    {
      this._super()
      this.installEditPolicy(new SelectionMenuPolicy())
    },
    getSVG: function(){
      return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="50" height="50">
                <path d="m 0 0 l 0 50 l 50 0 l 0 -50 z" stroke="#fff" stroke-width="1"></path>
                <path d="m 0 0 l 0 40 l 25 9 l 25 -9 l 0 -40" stroke="#1B1B1B" stroke-width="2" fill="none"></path>
              </svg>`
    },
  }),
  belt: draw2d.SVGFigure.extend({
    NAME: "Belt",
    init : function()
    {
      this._super()
    },
    getSVG: function(){
      return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="50" height="50">
                <path d="m 0 0 l 0 50 l 50 0 l 0 -50 z" stroke="#fff" stroke-width="1"></path>    
                <ellipse cx="5" cy="25" rx="5" ry="5" stroke="#1B1B1B" stroke-width="2"></ellipse>    
                <ellipse cx="45" cy="25" rx="5" ry="5" stroke="#1B1B1B" stroke-width="2"></ellipse>      
                <line x1="5" y1="20" x2="45" y2="20" stroke="#1B1B1B" stroke-width="2"></line>    
                <line x1="5" y1="30" x2="45" y2="30" stroke="#1B1B1B" stroke-width="2"></line>    
              </svg>`
    },
  }),
}