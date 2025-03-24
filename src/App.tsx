import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ROSLIB from 'roslib';
import ImageViewer from './components/ImageViewer';
import ArmSide from './components/RobotLink/RobotLinkSide';
import ArmTopBase from './components/RobotLink/ArmTopBase';
// import ArmFront from './components/RobotArm/ArmFront';

import ROSImageViewer from "./components/ROSImageViewer";


// import { motion } from "framer-motion";

interface IProps {

}
interface IState {
  Button_A_Flag: boolean
  Button_A_Value: number
  readROSInt16: number
  ros: ROSLIB.Ros
  allLinkData: number[];
  didMounted: boolean
}

const initialROS = (url: string) => {
  const ros = new ROSLIB.Ros({ url });
  return ros
}

class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      readROSInt16: 0,
      ros: initialROS('ws://10.10.199.124:9090'),
      Button_A_Flag: false,
      Button_A_Value: 0,
      didMounted: false,
      allLinkData: []
    }
  }

  // ✅ กด Spacebar เพื่อส่งค่าไปยัง ROS
  handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      this.setState({ Button_A_Flag: true });
      this.PublishInt16(this.state.ros, "/gui/buttonCommand", 1); // ส่งค่า 1 เมื่อกด Spacebar
      console.log("Spacebar Pressed: Sending 1");
    }
  };

  handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      this.setState({ Button_A_Flag: false });
      this.PublishInt16(this.state.ros, "/gui/buttonCommand", 0); // ส่งค่า 0 เมื่อปล่อย Spacebar
      console.log("Spacebar Released: Sending 0");
    }
  };

  SubscribeInt16 = (ros: ROSLIB.Ros, topicName: string) => {
    const robotReadTopic = new ROSLIB.Topic({
      ros: ros,
      name: topicName,
      messageType: 'std_msgs/Int16',
    });

    robotReadTopic.subscribe((message: ROSLIB.Message) => {
      const messageResponse = message as ROSLIB.Message & { data: number };
      this.setState({ readROSInt16: messageResponse.data });
    });
  };


  PublishInt16 = (ros: ROSLIB.Ros, topicName: string, value: number) => {
    const topic = new ROSLIB.Topic({
      ros: ros,
      name: topicName,
      messageType: 'std_msgs/Int16',
    });

    const Int16Message = new ROSLIB.Message({ data: value });
    topic.publish(Int16Message);
  };

  SubscribeAllLink = (ros: ROSLIB.Ros, topicName: string) => {
    const allLinkTopic = new ROSLIB.Topic({
      ros: ros,
      name: topicName,
      messageType: 'std_msgs/Int32MultiArray',
    });
  
    allLinkTopic.subscribe((message: ROSLIB.Message) => {
      const messageResponse = message as ROSLIB.Message & { data: number[] }; // ดึงข้อมูลที่เป็น array ของตัวเลข
      this.setState({ allLinkData: messageResponse.data }); // เก็บข้อมูลที่ได้รับใน state
    });
  };
  



  onROSConnection = () => {
    console.log("connected !")
    // this.SubscribeInt16(this.state.ros, '/gui/readInt16')
  }

  onROSError = () => {
    console.log("error")
  }

  onROSClose = () => {
    console.log("closed")
  }

  componentDidMount = () => {
    const { ros } = this.state;
    ros.on('connection', this.onROSConnection);
    ros.on('error', this.onROSError);
    ros.on('close', this.onROSClose);
  
    this.setState({ didMounted: true }); // ✅ เพิ่มตรงนี้

    this.SubscribeAllLink(ros, '/all_link'); 
  
    // ✅ เพิ่ม Event Listener สำหรับ Spacebar
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  };

  componentWillUnmount = () => {
    if (this.state.didMounted) {
      this.state.ros.close()
    }

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  


  render() {
    const { allLinkData } = this.state; // ดึงข้อมูลจาก state
    return (
      <Row>
        <div style={{ marginTop: '20px', marginLeft: '30px', width: '1500px'}}>
          <Row style={{ backgroundColor: 'cyan' }}>
            <h2>Camera</h2>
            <div className='col d-flex justify-content-center' style={{ gap: '20px', margin: '20px 0px 20px 20px' }}>
            <ImageViewer 
                ros={this.state.ros} 
                ImageCompressedTopic={'/usb_cam1/image_raw/compressed'} 
                width={'640px'} 
                height={'480px'} 
                rotate={0} 
                hidden={false} 
              />
            </div>
            <div className='col d-flex justify-content-center' style={{ gap: '20px', margin: '20px 0px 20px 20px' }}>
            <ImageViewer 
                ros={this.state.ros} 
                ImageCompressedTopic={'/usb_cam2/image_raw/compressed'} 
                width={'640px'} 
                height={'480px'} 
                rotate={0} 
                hidden={false} 
              />
            </div>
          </Row>
          
          <Row style={{ marginTop: '20px', width: '1500px', height: '380px', backgroundColor: 'yellow' }}>
              {/* <ul>
                {allLinkData.map((value, index) => (
                  <li key={index}>{value}</li> // แสดงค่าของแต่ละตัวใน array
                ))}
            </ul> */}
            {/* <h4>Robot Arm</h4>  */}
            <Col>
              <h2>robot side</h2>
              <ArmSide 
                  length1={80} length2={80} length3={80} length4={80} 
                  dergee1={allLinkData.length > 0 ? allLinkData[0] : 0} dergee2={allLinkData.length > 0 ? allLinkData[0] : 0} 
                  dergee3={allLinkData.length > 0 ? allLinkData[0] : 0} dergee4={allLinkData.length > 0 ? allLinkData[0] : 0}
                  color1="blue" color2="green" color3="blue" color4='blue' />
              <div style={{ display: 'flex',marginLeft: '40px', gap: '80px' }}>
                <h4>F_Back</h4>
                <h4>Arm</h4>
                <h4>F_Front</h4>
              </div>    
            </Col>
            <Col>
              <h2>Arm top base</h2>
              <ArmTopBase 
              length1={80} 
              dergee1={allLinkData.length > 0 ? allLinkData[0] : 0} 
              color1="blue"/>
              <div style={{ display: 'flex',marginLeft: '120px'}}>
                <h4>Base</h4>
              </div>   
            </Col>
            {/* <Col>
              <p>Armfront</p>
              <ArmFront degree1={10} length1={80} color1="blue" />
            </Col> */}
          </Row>
        </div>  

        <Row style={{ margin: '20px 0px 0px 20px', inlineSize: '500px', height: '985px' }}>
          <div style={{ backgroundColor: 'red', marginBottom: '20px' }}> 
            <h3>Show montion detect</h3>
            <ImageViewer 
                ros={this.state.ros} 
                ImageCompressedTopic={'/proc_montion_detect_image/compressed'} 
                width={'640px'} 
                height={'480px'} 
                rotate={0} 
                hidden={false} 
              />
              <h3>Show his proimg</h3>
              <ROSImageViewer ros={this.state.ros} />
          </div>
        </Row>
      </Row>
    );
  }
}

export default App;
