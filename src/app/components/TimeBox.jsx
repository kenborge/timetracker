'use strict';

var React = require('react'),
    TimeSlotActions = require('../actions/TimeSlotActions');

var TimeBox = React.createClass({
    getInitialState: function() {
        return {
            posX: undefined,
            posY: undefined,
            height: undefined
        };
    },
    componentDidMount: function () {
        var element = this.refs.box.getDOMNode();
        interact(element)
        .draggable({
            snap: {
                targets: [
                interact.createSnapGrid({ x: 1, y: this.props.hourSize/2 })
                ],
                offset: 'startCoords'
            },
        })
        .resizable({
            snap: {
                targets: [
                interact.createSnapGrid({ x: 1, y: this.props.hourSize/2 })
                ],
                offset: 'startCoords'
            },
            axis: 'y'
        })
        .on('dragstart', function (event) {
            this.setState({
                posX: 0,
                posY: this.props.timeSlot.startHour * this.props.hourSize
            });
        }.bind(this))
        .on('dragmove', function (event) {
            this.setState({
                posX: this.state.posX + event.dx,
                posY: this.state.posY + event.dy
            });
        }.bind(this))
        .on('dragend', function (event){
            TimeSlotActions.setStartHour(this.props.timeSlot.id, this.state.posY / this.props.hourSize);
            this.setState({
                posX: undefined,
                posY: undefined
            });
        }.bind(this))
        .on('resizestart', function (event) {
            this.setState({
                height: this.props.timeSlot.duration * this.props.hourSize
            });
        }.bind(this))
        .on('resizemove', function (event) {
            this.setState({
                height: this.state.height + event.dy
            });
        }.bind(this))
        .on('resizeend', function (event) {
            TimeSlotActions.setDuration(this.props.timeSlot.id, this.state.height / this.props.hourSize);
            this.setState({
                height: undefined
            });
        }.bind(this))
    },
    render: function() {
        var x = this.state.posX !== undefined ? this.state.posX : 0,
            y = this.state.posY !== undefined ? this.state.posY : this.props.timeSlot.startHour * this.props.hourSize,
            translateString = 'translate(' + x + 'px, ' + y + 'px)';
        var style = {
            backgroundColor: this.props.color ? this.props.color : 'red',
            WebkitTransform: translateString,
            transform: translateString,
            height: this.state.height !== undefined ? this.state.height : this.props.timeSlot.duration * this.props.hourSize
        }
        var duration = this.state.height ? this.state.height / this.props.hourSize : this.props.timeSlot.duration;
        return (
            <li className="timebox" ref="box" style={style} data-id={this.props.timeSlot.id} data-date={this.props.date} data-type="timebox">
                <h4>{this.props.name}</h4>
                <div>Duration: {duration}</div>
            </li>
        );
    }
});

module.exports = TimeBox;
