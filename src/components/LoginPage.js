import React from "react";
import { Form, Button, Input, Space, Checkbox, message, Modal, } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { login, register } from "../utils";

class LoginPage extends React.Component {
  formRef = React.createRef();
  state = {
    asManager: false,
    loading: false,
  };

  onFinish = () => {
    console.log("finish form");
  };
  handleCheckboxOnChange = (e) => {
    this.setState({
      asManager: e.target.checked,
    });
  };

  handleLogin = async () => {
    const formInstance = this.formRef.current;

    try {
      await formInstance.validateFields();
    } catch (error) {
      return;
    }

    this.setState({
      loading: true,
    });

    try {
      const { asManager } = this.state;
      const resp = await login(formInstance.getFieldsValue(true), asManager);
      this.props.handleLoginSuccess(resp.token, asManager);
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    return (
      <div style={{ width: 500, margin: "20px auto" }}>
        <Form ref={this.formRef} onFinish={this.onFinish} style={{ marginTop: "192px" }}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              disabled={this.state.loading}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email: email@example.com"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              disabled={this.state.loading}
              placeholder="Password"
            />
          </Form.Item>
        </Form>
        <Space>
          <Button
            onClick={this.handleLogin}
            disabled={this.state.loading}
            shape="round"
            type="primary"
          >
            Login
          </Button>
          <Checkbox
            disabled={this.state.loading}
            checked={this.state.asManager}
            onChange={this.handleCheckboxOnChange}
            style={{ marginLeft: "24px" }}
          >
            As Manager
          </Checkbox>
          <RegiterButton />
        </Space>
      </div>
    );
  }
}

class RegiterButton extends React.Component {
  formRef = React.createRef();
  state = {
    asManager: false,
    loading: false,
    modalVisible: false,
  }
  onFinish = () => {
    console.log("finish form");
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleCheckboxOnChange = (e) => {
    this.setState({
      asManager: e.target.checked,
    });
  };

  handleRegister = async () => {
    const formInstance = this.formRef.current;
    try {
      await formInstance.validateFields();
    } catch (error) {
      return;
    }

    this.setState({
      loading: true,
    });

    try {
      await register(formInstance.getFieldsValue(true), this.state.asManager);
      message.success("Thanks for signing up!");
      this.handleCancel();
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  handleLoginPageRegister = () => {
    this.setState({
      modalVisible: true,
    });
  };

  render() {
    return (
      <>
        <Button onClick={this.handleLoginPageRegister} shape="round" type="link" >
          New here? Create your account
        </Button>
        <Modal
          destroyOnClose={true}
          title="Create Your Account"
          visible={this.state.modalVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Form
            preserve={false}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            ref={this.formRef}
            onFinish={this.onFinish}
          >
            <Form.Item name="account_type"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 20 }}
              style={{ marginLeft: "158px", marginBottom: "20px" }}
            >
              <Checkbox
                disabled={this.state.loading}
                checked={this.state.asManager}
                onChange={this.handleCheckboxOnChange}
              >
                Registering a manager account?
              </Checkbox>
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input
                disabled={this.state.loading}
                placeholder="your name"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true }]}
            >
              <Input
                disabled={this.state.loading}
                placeholder="email@example.com"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true }]}
            >
              <Input.Password
                disabled={this.state.loading}
                placeholder="*****—*****—*****"
              />
            </Form.Item>

            <Form.Item
              label="Room Number(optional)"
              name="room"
            >
              <Input
                disabled={this.state.loading || this.state.asManager}
                placeholder="only for resident signing up"
              />
            </Form.Item>
            <Space style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={this.handleRegister}
                disabled={this.state.loading}
                loading={this.state.loading}
                shape="round"
                type="primary"
                htmlType="submit"
              >
                Create Account
              </Button>
            </Space>
          </Form>
        </Modal>
      </>
    );
  }
}

export default LoginPage;