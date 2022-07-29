import { Layout, Menu, Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import LoginPage from "./components/LoginPage";

const { Component } = React;
const { Header, Content } = Layout;
class App extends Component {
  state = {
    authed: false,
    asManager: false,
  }
  componentDidMount() {
    const authToken = localStorage.getItem("authToken");
    const asManager  = localStorage.getItem("asManager") === "true";
    this.setState({
      authed: authToken !== null,
      asManager, 
    });
  }

  handleLoginSuccess = (token, asManager) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("asManager", asManager);
    this.setState({
      authed: true,
      asManager,
    });
  };

  handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("asManager");
    this.setState({
      authed: false,
    });
  }

  userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={this.handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  renderContent() {
    if (!this.state.authed) {
      return <LoginPage handleLoginSuccess={this.handleLoginSuccess}/>
    }
  }
  
  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <Header style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#6667AB", height: "96px"}}>
          <div style={{ fontSize: 30, fontWeight: 600, color: "white", lineHeight: "96px" }}>
            SweetHome
          </div>
          {this.state.authed && (
            <div>
              <Dropdown trigger="click" overlay={this.userMenu}>
                <Button icon={<UserOutlined />} shape="circle" />
              </Dropdown>
            </div>
          )}
        </Header>
        <Content>
          {this.renderContent()}
        </Content>
      </Layout>
    )
  }
}

export default App;