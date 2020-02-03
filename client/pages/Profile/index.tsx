import * as React from 'react'
import { Row, Col, Typography, Icon, Divider } from 'antd'
import { LayoutComponent } from '../../src/components/Layout/Layout'

export default props => (
  <LayoutComponent>
  <Row>
      <Col span={7}>
        <div style={{ backgroundColor: '#9bbbb1', paddingTop: 20, textAlign: 'justify', paddingBottom: 10, borderRadius: 5 }}>
            <div style={{textAlign: 'center'}}>
                <Typography.Title style={{color: '#f5f5f5'}}>Onur Özkan</Typography.Title>
                <a href="#">
                    <Typography.Text style={{color: '#f5f5f5', position: 'relative', bottom: 15}}>
                        <Icon type="user" style={{paddingLeft: 10}}/> onurozkan
                    </Typography.Text>
                </a>
            </div>
            <Divider dashed style={{borderColor: '#212121'}}/>
            <div style={{textAlign:'center', paddingLeft: 15}}>
                <Typography.Text style={{color: '#212121', fontSize: 20}}>
                    <Icon type="trophy" style={{color: '#212121', paddingLeft: 10}}/> Feed Score
                </Typography.Text>
            </div>
            <div style={{padding: 20}}>
                <span style={{color: '#212121'}}>
                    <Icon type="global" /> 150
                </span>
                <hr style={{ borderColor:'transparent' }} />
                <span style={{color: '#212121'}}>
                    <Icon type="flag" /> 51
                </span>
            </div>
        </div>
      </Col>
    </Row>
  </LayoutComponent>
)
