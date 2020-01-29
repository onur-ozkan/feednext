import * as React from 'react'
import { Row, Col, Typography, Icon, Divider } from 'antd'
import { LayoutComponent } from '../../src/components/Layout/Layout'

export default props => (
  <LayoutComponent>
  <Row>
      <Col span={7}>
        <div style={{ backgroundColor: '#111111', paddingTop: 20, paddingBottom: 10, borderRadius: 5 }}>
            <div style={{textAlign: 'center'}}>
                <Typography.Title style={{color: 'white'}}>Onur Özkan</Typography.Title>
                <a href="#">
                    <Typography.Text style={{color: 'white', position: 'relative', bottom: 15}}>
                        <Icon type="user" style={{color: 'white', paddingLeft: 10}}/> onurozkan
                    </Typography.Text>
                </a>
            </div>
            <Divider dashed style={{borderColor: '#ff594a'}}/>
            <div style={{textAlign:'center', paddingLeft: 15}}>
                <Typography.Text style={{color: 'white', fontSize: 20}}>
                    <Icon type="trophy" style={{color: 'white', paddingLeft: 10}}/> Feed Score
                </Typography.Text>
            </div>
            <div style={{padding: 20}}>
                <span style={{color: 'white'}}>
                    <Icon type="global" /> 150
                </span>
                <hr style={{ borderColor:'transparent' }} />
                <span style={{color: 'white'}}>
                    <Icon type="flag" /> 51
                </span>
            </div>
        </div>
      </Col>
    </Row>
  </LayoutComponent>
)
