const draw2d = window.draw2d
const $ = window.$

const SelectionMenuPolicy = draw2d.policy.figure.SelectionPolicy.extend({
  NAME: 'SelectionMenuPolicy',
  init: function(attr, setter, getter) {
    this.overlay = null
    this._super(attr, setter, getter)
  },
  onSelect: function(canvas, figure, isPrimarySelection) {
    this._super(canvas, figure, isPrimarySelection);

    if (this.overlay === null) {
      const equipmentSettings = `
        <div class="overlayMenu">

          <table>
            <thead>
              <tr>
                <th colspan="2">CV01 - Feed Conveyor</th>
              </tr>
            </thead>
            
            <tbody>
              <tr>
                <td>
                  <label>Volume [m3]:</label>
                </td>
                <td>
                  <input type="text"/>
                </td>
              </tr>
              
              <tr>
                <td>
                  <label>Mass capacity [t]:</label>
                </td>
                <td>
                  <input type="text"/>
                </td>
              </tr>
              
              <tr>
                <td>
                  <label>Dual tip:</label>
                </td>
                <td>
                  <input type="radio"/>
                </td>
              </tr>
              
              <tr>
                <td colspan="2">
                  <hr>
                </td>
              </tr>
              
              <tr>
                <td colspan="2">
                  <a href="#">Electrical load analysis</a>                
                </td>
              </tr>
              
              <tr>
                <td colspan="2">
                  <a href="#">Belt weigher calibration</a>                
                </td>
              </tr>
              
              <tr>
                <td colspan="2">
                  <a href="#">Burden control analysis</a>                
                </td>
              </tr>
              
              <tr>
                <td colspan="2">
                  <a href="#">Acceleration profile analysis</a>                
                </td>
              </tr>
              
            </tbody>
          </table>
          
        </div>
      `

      this.overlay= $(equipmentSettings);
      $('#canvas').append(this.overlay);
      /*this.overlay.on("click",function(){
        debugger
        // use a Command and CommandStack for undo/redo support
        //
        var command= new draw2d.command.CommandDelete(figure);
        canvas.getCommandStack().execute(command);
      })*/
    }
    this.posOverlay(figure);
  },
  onUnselect: function(canvas, figure )
  {
    const self = this

    self._super(canvas, figure);

    setTimeout(function() {
      self.overlay.remove();
      self.overlay=null;
    }, 0)
  },
  onDrag: function(canvas, figure)
  {
    this._super(canvas, figure);
    this.posOverlay(figure);
  },

  posOverlay:function(figure)
  {
    this.overlay.css({
      "top":figure.getAbsoluteY()-20,
      "left":figure.getAbsoluteX()+ figure.getWidth()+40,
      "z-index": 1000,
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
                <path d="m 0 0 l 0 40 l 25 9 l 25 -9 l 0 -40" stroke="#1B1B1B" stroke-width="2" fill="none"/>
              </svg>`
    }

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
    }

  }),
}