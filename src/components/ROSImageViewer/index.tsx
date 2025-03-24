// src/components/ROSImageViewer.tsx
import React, { Component } from "react";
import ROSLIB from "roslib";

interface IProps {
  ros: ROSLIB.Ros;
}

interface IState {
  images: string[]; // เก็บ URL ของภาพทั้งหมด
}

class ROSImageViewer extends Component<IProps, IState> {
  private imageTopic: ROSLIB.Topic | null = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      images: [], // เก็บภาพที่รับจาก ROS
    };
  }

  componentDidMount() {
    this.subscribeToImage();
  }

  componentWillUnmount() {
    if (this.imageTopic) {
      this.imageTopic.unsubscribe();
    }
  }

  subscribeToImage = () => {
    const { ros } = this.props;

    this.imageTopic = new ROSLIB.Topic({
      ros: ros,
      name: "/image_topic/compressed", // ✅ เปลี่ยนเป็น topic ที่ต้องการ
      messageType: "sensor_msgs/CompressedImage", // ใช้ประเภทที่ถูกต้อง
    });

    this.imageTopic.subscribe((message: ROSLIB.Message) => {
      const compressedMessage = message as ROSLIB.Message & { format: string; data: string };
      const imageUrl = `data:image/${compressedMessage.format};base64,${compressedMessage.data}`;

      // เก็บภาพใหม่เข้าไปใน state โดยไม่ลบภาพเก่า
      this.setState((prevState) => ({
        images: [...prevState.images, imageUrl], // เพิ่มภาพใหม่ลงในประวัติ
      }));
    });
  };

  render() {
    return (
      <div>
        {/* <h3>Reference Image Feed (History)</h3> */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            maxHeight: "500px", // กำหนดความสูงที่ต้องการให้เลื่อนได้
            overflowY: "auto", // เปิดการเลื่อนในแนวตั้ง
            border: "1px solid #ccc", // กรอบเล็กๆ รอบๆ กล่อง
            padding: "10px", // ช่องว่างระหว่างกรอบกับภาพ
          }}
        >
          {this.state.images.map((img, index) => (
            <div key={index}>
              <h5>Image {index + 1}</h5>
              <img src={img} alt={`Ref Image ${index}`} width="320" height="240" />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ROSImageViewer;
