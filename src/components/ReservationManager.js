import React, { useState } from "react";
import {
    Button,
    Row,
    Col,
    message,
    List,
    Modal,
    DatePicker,
    Input,
    Form,
    Select,
    Layout
} from "antd";

import "../styles/ReservationManager.css"
const { Content } = Layout;
const ReservationManager = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [maintenanceList] = useState([]);

    const showModal = () => {
        setModalVisible(true);
    };
    const handleCancel = () => {
        setModalVisible(false);
    };
    const onCancelSubmit = () => { };
    const onAddSubmit = () => { };
    const onUpdateSubmit = () => { };

    return (
        <Layout
            className="manager-reservation-layout"
        >
            <Content
                className="manager-reservation-content"
                >
                <Layout
                className="manager-reservation-form-layout"
                style={{background: "white", borderRadius: "2vh"}}>
                    <Content 
                    className="manager-reservation-form-content"
                    >
                        <div className="manager-reservation-form"
                            style={{ height: "100%" }}>
                            <div style={{ width: "72%", marginLeft: "7%"}}>
                                    <div>
                                        <List
                                            className="manager-maintenance"
                                            itemLayout="horizontal"
                                            dataSource={maintenanceList}
                                        >
                                            {(item) => (
                                                <List.Item>
                                                    <p>{item.date}</p>
                                                    <Button 
                                                    type="primary"
                                                    shape="round"
                                                    size="large"
                                                     onClick={showModal}>
                                                        update
                                                    </Button>
                                                    <Modal
                                                        title="maintenance-update"
                                                        visible={modalVisible}
                                                        onCancel={handleCancel}
                                                    >
                                                        <div>details</div>
                                                        <Form
                                                            className="maintenance-time"
                                                            labelCol={{ span: 8 }}
                                                            wrapperCol={{ span: 16 }}
                                                            onFinish={onUpdateSubmit}
                                                        >
                                                            <Form.Item
                                                                label="Time"
                                                                rules={[{ required: true, message: 'Time' }]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                                <Button
                                                                    type="primary"
                                                                    htmlType="submit"
                                                                    shape="round"
                                                                    size="large"
                                                                >
                                                                    update
                                                                </Button>
                                                            </Form.Item>
                                                        </Form>
                                                    </Modal>
                                                </List.Item>
                                            )}
                                        </List>
                                    </div>
                                    <div

                                    >
                                        <div>
                                            <Form
                                                className="public-cancel"
                                                labelCol={{ span: 8 }}
                                                wrapperCol={{ span: 16 }}
                                                onFinish={onCancelSubmit}
                                            >
                                                <Form.Item
                                                    label="Category"
                                                    rules={[{ required: true, message: 'Category' }]}
                                                >
                                                    <Select></Select>
                                                </Form.Item>
                                                <Form.Item
                                                    label="Date"
                                                >
                                                    <DatePicker />
                                                </Form.Item>
                                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        shape="round"
                                                        size="large"
                                                    >
                                                        cancel
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </div>
                                        <div
                                        >
                                            <Form
                                                className="public-add"
                                                labelCol={{ span: 8 }}
                                                wrapperCol={{ span: 16 }}
                                                onFinish={onAddSubmit}
                                            >
                                                <Form.Item
                                                    label="Category"
                                                    rules={[{ required: true, message: 'Category' }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        shape="round"
                                                        size="large"
                                                    >
                                                        add
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
}

export default ReservationManager;