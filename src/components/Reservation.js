import React, { useState, useEffect } from "react";
import {RequestDetailButton} from "./ReservationManager"
import {
    Button,
    Row,
    Col,
    message,
    Tabs,
    List,
    Modal,
    DatePicker,
    Input,
    Form,
    Select,
    Layout,
    TimePicker,
    Card,
    Carousel,
    Tooltip,
    Space,
    Typography,
    Image,
} from "antd";
import {
    LeftCircleFilled,
    RightCircleFilled,
    InfoCircleOutlined,
  } from "@ant-design/icons";
import {
    getAllPublicUtils,
    getAllMaintenanceRequestById,
    reservePublicUtil,
    getAvailableTimeFrame,
    listAllPublicUtilsReservations,
    sendMaintenanceRequest,
} from "../utils"

import "../styles/ReservationManager.css"
const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const Reservation = () => {
    const [maintenanceList, setMaintenanceList] = useState([])
    const [utils, setUtils] = useState([])
    const [loadingMaintenance, setLoadingMaintenance] = useState(false);
    const [loadingUtils, setLoadingUtils] = useState(false);
    const getAllRequests = async () => {
        try {
            setLoadingMaintenance(true)
            const resp = await getAllMaintenanceRequestById();
            setMaintenanceList(oldData => [...resp]);
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoadingMaintenance(false);
        }
    }
    const getAllUtils = async () => {
        try {
            setLoadingUtils(true);
            const resp = await listAllPublicUtilsReservations();
            setUtils(oldData => [...resp]);
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoadingUtils(false);
        }
    }
    useEffect(() => {
        getAllRequests();
        getAllUtils()
    }, []);
        return (
            <Layout
            className="reservation-layout"
            >
        <Row>
            <Col className="maintenance-title-col">
                <Content className="maintenance-title-col-content">
                    Reserve Maintenance/Utils
                    </Content>
                </Col>
            <Col className="public-utils-title-col">
                <Content className="public-utils-title-col-content">
                    All Reservation
                </Content>
            </Col>
        </Row>
        <Row className="reservation-row-layout">
            <Col className="maintenance-col" span={7}>
                <Content
                className="manager-reservation-content">
                    <ReserveSomething 
                    getAllRequests={getAllRequests}
                    getAllUtils={getAllUtils}
                    />
                </Content>
            </Col>
            <Col className="public-utils-col" span={7}>
                <Content className="public-utils-content">
                    <ReservationList 
                    maintenanceList={maintenanceList}
                    utils={utils}
                    loadingMaintenance={loadingMaintenance}
                    loadingUtils={loadingUtils}
                    />
                </Content>
            </Col>
        </Row>
    </Layout>           
    );
}

const ReserveSomething = ({getAllRequests, getAllUtils}) => {
    return (
        <div className="card-container">
            <Tabs 
            defaultActiveKey="1" 
            type="card">
                <TabPane tab="Maintenance" key="1">
                    <SendMaintenanceRequest getAllRequests={getAllRequests}/>
                </TabPane>
                <TabPane tab="Utils" key="2">
                    <ReservePublicUtil getAllUtils={getAllUtils}/>
                </TabPane>
            </Tabs>
        </div>
    );
}

const ReservationList = ({maintenanceList, utils, loadingMaintenance, loadingUtils}) => {
    return (
        <div className="card-container">
            <Tabs 
            defaultActiveKey="1" 
            type="card"
            destroyInactiveTabPane={true}
            >
                <TabPane tab="Maintenance" key="1">
                    <MaintenanceList 
                    maintenanceList={maintenanceList}
                    loadingMaintenance={loadingMaintenance}
                    />
                </TabPane>
                <TabPane tab="Utils" key="2">
                    <UtilsList 
                    utils={utils}
                    loadingUtils={loadingUtils}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}

const MaintenanceList = ({maintenanceList, loadingMaintenance}) => {
    return (
        <Content>
        <div>
            <List
                className="manager-maintenance-list"
                grid={{ gutter: 0, column: 1 }}
                size="middle"
                loading={loadingMaintenance}
                dataSource={maintenanceList}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            key={item.id}
                            title={
                                <div className="card-content">
                                    <Text ellipsis={true} 
                                    style={item.start_time !== null ? {} : { color : "red"}}>
                                        {item.user.name + ' ' + item.user.room}
                                    </Text>
                                    < RequestDetailButton item={item} />
                                </div>
                            }
                        >
                            {item.description}
                        </Card>
                    </List.Item>
                )} 
            />
        </div>
        </Content>
    )
}

const UtilsList = ({utils, loadingUtils}) => {
    return (
        <Content>
        <div>
            <List
                className="manager-maintenance-list"
                grid={{ gutter: 0, column: 1 }}
                size="middle"
                loading={loadingUtils}
                dataSource={utils}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            key={item.id}
                            title={
                                <div sclassName="card-content">
                                    <Text ellipsis={true}>
                                        {item.category}
                                    </Text>
                                </div>
                                
                            }
                        >
                            {
                                <div>
                                    <p>
                                        <Text ellipsis={true} >
                                        Date: {item.date}
                                        </Text>
                                        <br/>
                                        <br/>
                                        <Text ellipsis={true} >
                                        Time Slot: {item.time_frame}
                                        
                                        </Text>
                                    </p>     
        
                                </div>
                            }
                            
                        </Card>
                    </List.Item>
                )} 
            />
        </div>
        </Content>
    )
}

class SendMaintenanceRequest extends React.Component {
    state = {
        loading: false,
      }; 
    fileInputRef = React.createRef();
    onMaintenanceSubmit = async (values) => {
        const formData = new FormData();
        const { files } = this.fileInputRef.current;
        
        if (files.length > 5) {
            message.error("You can at most upload 5 pictures.");
            return;
        }

        for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i]);
        }

        formData.append("description", values.description);
        this.setState({
            loading: true,
          });
        try {
            await sendMaintenanceRequest(formData);
            message.success("upload successfully");
            const {getAllRequests} = this.props;
            getAllRequests();
        } catch (error) {
            message.error(error.message);
        } finally {
            this.setState({
                loading: false,
            });
        }
    }
    render() {
        return (
            <div>
                <Form
                    className="problem-submit"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={this.onMaintenanceSubmit}
                >
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Input your Description' }]}
                    >
                        <TextArea showCount maxLength={150}/>
                    </Form.Item>
                    <Form.Item
                        name="picture"
                        label="Picture"
                        rules={[{ required: true, message: "Upload images for demostration" }]}
                    >
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            ref={this.fileInputRef}
                            multiple={true}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={this.state.loading}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const ReservePublicUtil = ({getAllUtils}) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const loadCategories = async () => {
        try {
            const resp = await getAllPublicUtils();
            setCategories(oldData => [...resp]);
        } catch (error) {
            message.error(error.message);
        }
    }
    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <Content>
        <div>
            <List
                className="manager-maintenance-list"
                grid={{ gutter: 0, column: 1 }}
                size="middle"
                loading={loading}
                dataSource={categories}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            key={item.id}
                            title={
                                <div className="card-content">
                                    <Text ellipsis={true}>
                                        {item.category}
                                    </Text>
                                </div>
                            }
                            extra={<ReserveUtilButton category={item.category}
                            getAllUtils={getAllUtils}
                            />}
                        >
                            {item.description}
                        </Card>
                    </List.Item>
                )} 
            />
        </div>
        </Content>
    )

}

const ReserveUtilButton = ({category, getAllUtils}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timeslots, setTimeSlots] = useState([])
    const getAvailableTime = async (category) => {
        try {
            setLoading(true);
            const resp = await getAvailableTimeFrame(category);
            setTimeSlots(oldData => [...resp])
        } catch (error) {
            message.error(error.message)
        }  finally {
            setLoading(false);
        }
    }
    const handleCancel = () => {
        setModalVisible(false);
    }
    const handleSelect = () => {
        setModalVisible(true);
        getAvailableTime(category);
    }
    

    return (
        <>
        <Button 
        type="primary"
        shape="round"
        size="medium"
        onClick={handleSelect}>
            Reserve
        </Button>
        <Modal
            destroyOnClose={true}
            loading={loading}
            title="maintenance-update"
            visible={modalVisible}
            onCancel={handleCancel}
            footer={null}
        >
        <List
            grid={{ gutter: 8, column: 3 }}
            size="middle"
            dataSource={timeslots}
            renderItem={(slot) => (
                <List.Item>
                    <TimeSlotButton 
                    category={category}
                    timeSlot={slot}
                    getAvailableTime={getAvailableTime}
                     getAllUtils={getAllUtils}
                    />
                </List.Item>
                )} 
            />
        </Modal>
        </>

    )

}

const TimeSlotButton = ({category, timeSlot, getAvailableTime, getAllUtils}) => {
    const [loading, setLoading] = useState(false);
    const onClick = async () => {
        try {
            setLoading(true);
            console.log(category)
            await reservePublicUtil(category, timeSlot.date, timeSlot.time_frame);
            message.success(`successfully reserve ${category}`);
            getAvailableTime(category);
            getAllUtils();
        } catch(error) {
            message.error(error.message);
        } finally{
            setLoading(false);
        }
    }
    return (
        <Button
        type="primary"
        size="large"
        loading={loading}
        onClick={onClick}
        >
            {
                <Space direction="vertical">
                <Text type="secondary">
                {timeSlot.date}
                </Text>
                <Text type="secondary">
                {timeSlot.time_frame}
                </Text>
                </Space>
            }
        </Button>
    )
}

export default Reservation;