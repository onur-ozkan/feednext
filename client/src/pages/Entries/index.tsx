import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import { Button, Card, Col, List, Row, Select, Tag } from 'antd';
import { LoadingOutlined, StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';

import { Dispatch } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'dva';
import ArticleListContent from './components/ArticleListContent';
import { StateType } from './model';
import { ListItemDataType } from './data.d';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;

const pageSize = 5;

interface EntriesProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  entries: StateType;
  loading: boolean;
}

class Entries extends Component<EntriesProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'entries/fetch',
      payload: {
        count: 5,
      },
    });
  }

  setOwner = () => {
    const { form } = this.props;
    form.setFieldsValue({
      owner: ['wzj'],
    });
  };

  fetchMore = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'entries/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  render() {
    const {
      form,
      entries: { list },
      loading,
    } = this.props;
    const { getFieldDecorator } = form;

    const owners = [
      {
        id: 'wzj',
        name: 'Myself',
      },
      {
        id: 'wjh',
        name: 'Wu Jiahao',
      },
      {
        id: 'zxx',
        name: 'Zhou Xingxing',
      },
      {
        id: 'zly',
        name: 'Zhao Liying',
      },
      {
        id: 'ym',
        name: 'Yao Ming',
      },
    ];

    const IconText: React.FC<{
      type: string;
      text: React.ReactNode;
    }> = ({ type, text }) => {
      switch (type) {
        case 'star-o':
          return (
            <span>
              <StarOutlined style={{ marginRight: 8 }} />
              {text}
            </span>
          );
        case 'like-o':
          return (
            <span>
              <LikeOutlined style={{ marginRight: 8 }} />
              {text}
            </span>
          );
        case 'message':
          return (
            <span>
              <MessageOutlined style={{ marginRight: 8 }} />
              {text}
            </span>
          );
        default:
          return null;
      }
    };

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 },
      },
    };

    const loadMore = list.length > 0 && (
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
          {loading ? (
            <span>
              <LoadingOutlined /> Loading...
            </span>
          ) : (
            'load more'
          )}
        </Button>
      </div>
    );

    return (
      <>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="Category" block style={{ paddingBottom: 11 }}>
              <FormItem>
                {getFieldDecorator('category')(
                  <TagSelect expandable>
                    <TagSelect.Option value="cat1">Category one</TagSelect.Option>
                    <TagSelect.Option value="cat2">Category two</TagSelect.Option>
                    <TagSelect.Option value="cat3">Category three</TagSelect.Option>
                    <TagSelect.Option value="cat4">Category four</TagSelect.Option>
                    <TagSelect.Option value="cat5">Category five</TagSelect.Option>
                    <TagSelect.Option value="cat6">Category six</TagSelect.Option>
                    <TagSelect.Option value="cat7">Category Seven</TagSelect.Option>
                    <TagSelect.Option value="cat8">Category Eight</TagSelect.Option>
                    <TagSelect.Option value="cat9">Category Nine</TagSelect.Option>
                    <TagSelect.Option value="cat10">Category ten</TagSelect.Option>
                    <TagSelect.Option value="cat11">Category XI</TagSelect.Option>
                    <TagSelect.Option value="cat12">Category 12</TagSelect.Option>
                  </TagSelect>,
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="owner" grid>
              {getFieldDecorator('owner', {
                initialValue: ['wjh', 'zxx'],
              })(
                <Select
                  mode="multiple"
                  style={{ maxWidth: 286, width: '100%' }}
                  placeholder="select owner"
                >
                  {owners.map(owner => (
                    <Option key={owner.id} value={owner.id}>
                      {owner.name}
                    </Option>
                  ))}
                </Select>,
              )}
              <a className={styles.selfTrigger} onClick={this.setOwner}>
                Just look at yourself
              </a>
            </StandardFormRow>
            <StandardFormRow title="Other options" grid last>
              <Row gutter={16}>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                  <FormItem {...formItemLayout} label="active user">
                    {getFieldDecorator(
                      'user',
                      {},
                    )(
                      <Select placeholder="Unlimited" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="lisa">Li San</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                  <FormItem {...formItemLayout} label="Praise of">
                    {getFieldDecorator(
                      'rate',
                      {},
                    )(
                      <Select placeholder="Unlimited" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="good">excellent</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List<ListItemDataType>
            size="large"
            loading={list.length === 0 ? loading : false}
            rowKey="id"
            itemLayout="vertical"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item
                key={item.id}
                actions={[
                  <IconText key="star" type="star-o" text={item.star} />,
                  <IconText key="like" type="like-o" text={item.like} />,
                  <IconText key="message" type="message" text={item.message} />,
                ]}
                extra={<div className={styles.listItemExtra} />}
              >
                <List.Item.Meta
                  title={
                    <a className={styles.listItemMetaTitle} href={item.href}>
                      {item.title}
                    </a>
                  }
                  description={
                    <span>
                      <Tag>Ant Design</Tag>
                      <Tag>Design language</Tag>
                      <Tag>Ant Financial</Tag>
                    </span>
                  }
                />
                <ArticleListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </>
    );
  }
}

const WarpForm = Form.create<EntriesProps>({
  onValuesChange({ dispatch }: EntriesProps) {
    // Request data when form items change
    // Simulation query form takes effect
    dispatch({
      type: 'entries/fetch',
      payload: {
        count: 8,
      },
    });
  },
})(Entries);

export default connect(
  ({
    entries,
    loading,
  }: {
    entries: StateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    entries,
    loading: loading.models.entries,
  }),
)(WarpForm);
