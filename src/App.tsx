import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import iRAPLogo from './resources/iRAP_Logo.png';
import ROSLIB from 'roslib';
import ImageViewer from './components/ImageViewer';
import GamepadComponent from './components/GamepadAPI';


interface IProps {

}
interface IState {
  Button_A_Flag: boolean
  Button_A_Value: number
  readROSInt16: number
  ros: ROSLIB.Ros
  didMounted: boolean
  joystickAxes: number[]; // Store axes values
  joystickButtons: number[]; // Store button states
}

const initialROS = (url: string) => {
  const ros = new ROSLIB.Ros(({ url }));
  return ros
}

class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      readROSInt16: 0,
      ros: initialROS('ws://0.0.0.0:9090'),
      Button_A_Flag: false,
      Button_A_Value: 0,
      didMounted: false,
      joystickAxes: [], // Initialize axes state
      joystickButtons: [], // Initialize buttons state
    }
  }

  // onButtonAClickHandle = () => {
  //   this.setState({
  //     Button_A_Value: this.state.Button_A_Value + 1,
  //     Button_A_Flag: !this.state.Button_A_Flag
  //   })

  //   const { ros } = this.state;
  //   this.PublishInt16(ros, "/gui/buttonCommand", this.state.Button_A_Value)
  //   console.log("onButtonClickHandle : ", this.state.Button_A_Flag)
  // }

  // onButtonBClickHandle = () => {

  // }

  SubscribeJoy = (ros: ROSLIB.Ros) => {
    const joyTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/joy', // ROS topic for joystick
      messageType: 'sensor_msgs/Joy', // ROS message type for joystick data
    });

    joyTopic.subscribe((message: ROSLIB.Message) => {
      const joyMessage = message as { axes: number[], buttons: number[] };
      // Update state with joystick data
      this.setState({
        joystickAxes: joyMessage.axes,
        joystickButtons: joyMessage.buttons
      });
    });
  };

  // Publish joystick commands (Optional)
  PublishJoystickCommand = (ros: ROSLIB.Ros, value: number) => {
    const joypadRosTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/joy', // Use appropriate topic
      messageType: 'std_msgs/Int16',
    });

    const joyMessage = new ROSLIB.Message({
      data: value,
    });

    joypadRosTopic.publish(joyMessage);
  };
  // Subscribe to an int
  
// make sub and pub joy
  SubscribeInt16 = (ros: ROSLIB.Ros, topicName: string) => {
    const robotReadTopic = new ROSLIB.Topic({
      ros: ros,
      name: topicName, // adjust the topic name based on your setup
      messageType: 'std_msgs/Int16',
    });

    robotReadTopic.subscribe((message: ROSLIB.Message) => {
      const messageResponse = message as ROSLIB.Message &
      {
        data: number,
      };

      this.setState({ readROSInt16: messageResponse.data });
    });

  }


  PublishInt16 = (ros: ROSLIB.Ros, topicName: string, value: number) => {
    const joypadRosTopic = new ROSLIB.Topic({
      ros: ros,
      name: topicName, 
      messageType: 'std_msgs/Int16', 
    });


    const Int16Message = new ROSLIB.Message({
      data: value,
    });


    joypadRosTopic.publish(Int16Message)
  }



  onROSConnection = () => {
    console.log("connected !")
    this.SubscribeInt16(this.state.ros, '/gui/readInt16')
  }

  onROSError = () => {
    console.log("error")
  }

  onROSClose = () => {
    console.log("closed")
  }

  componentDidMount = () => {
    const { ros } = this.state;
    ros.on('connection', this.onROSConnection)
    ros.on('error', this.onROSError)
    ros.on('close', this.onROSClose)

    // Subscribe to joystick data
    this.SubscribeJoy(ros);  // Subscribe to the /joy topic
  }

  componentWillUnmount = () => {
    if (this.state.didMounted) {
      this.state.ros.close()
    }
  }




  render() {
    return (
      <Row>
        <div style={{ backgroundColor: 'cyan',marginTop: '20px' ,marginLeft: '30px',width: '1300px', height:'900px'}}>
        <h2>Camera</h2>
          <Row>
            <div className='col d-flex justify-content-center ' style={{margin: '0px 0px 0px 20px'}}>
              { <ImageViewer ros={this.state.ros} ImageCompressedTopic={'/usb_cam/image_raw/compressed'} width={'640px'} height={'480px'} rotate={0} hidden={false}></ImageViewer> }
            </div>
          </Row>
          <Row>
              <div className='col d-flex justify-content-center main-camera' style={{ gap: '20px' ,margin: '20px 0px 20px 20px'}}>
                { <ImageViewer ros={this.state.ros} ImageCompressedTopic={'/usb_cam/image_raw/compressed'} width={'640px'} height={'480px'} rotate={0} hidden={false}></ImageViewer> }
                { <ImageViewer ros={this.state.ros} ImageCompressedTopic={'usb_cam/image_raw/compressed'} width={'640px'} height={'480px'} rotate={0} hidden={false}></ImageViewer> }
              </div>
          </Row>
          <Row>
            <div>
                {/* Display Joystick Data */}
                <h3>Joystick Axes</h3>
                <pre>{JSON.stringify(this.state.joystickAxes)}</pre> {/* Display axes values */}
                <h3>Joystick Buttons</h3>
                <pre>{JSON.stringify(this.state.joystickButtons)}</pre> {/* Display button states */}
            </div>
          </Row>
        </div>  
        <Row style={{ backgroundColor: 'cyan',margin: '20px 0px 0px 20px',inlineSize: '500px', height: '930px'}}>
            <div style={{backgroundColor: 'gray', margin: '20px 0px 20px 0px'}}>
              <h1>robot arm</h1> 
            </div>
            <div style={{backgroundColor: 'red', marginBottom: '20px'}}>  
              <h1>opencv</h1> 
              <div className='col d-flex justify-content-center main-camera' style={{margin: '20px 20px 20px 20px'}}>
                { <ImageViewer ros={this.state.ros} ImageCompressedTopic={'/usb_cam/image_thresholded/compressed'} width={'640px'} height={'480px'} rotate={0} hidden={false}></ImageViewer> }
              </div>
            </div>
        </Row>
      </Row>

    );
  }
}

export default App;
