import React, { Component } from 'react';

class CustomButton extends Component {
    render() {
        return (
            <div className="pure-control-group">       
                <label></label>                           
                <button type="submit" className="pure-button pure-button-primary">{this.props.label}</button>                                    
            </div>
        );
    }
}

export default CustomButton;