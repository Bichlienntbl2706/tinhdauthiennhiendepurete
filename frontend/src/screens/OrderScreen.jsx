// import { useEffect } from 'react';
// import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
// import { Row, Col, ListGroup, Image, Card, Button, Container } from 'react-bootstrap';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import Message from '../components/Message';
// import Loader from '../components/Loader';
// import {
//   useDeliverOrderMutation,
//   useGetOrderDetailsQuery,
//   usePayOrderMutation,
// } from '../slices/ordersApiSlice';
// import axios from 'axios';

// const OrderScreen = () => {
//   const { id: orderId } = useParams();
//   const location = useLocation();

//   const {
//     data: order,
//     refetch,
//     isLoading,
//     error,
//   } = useGetOrderDetailsQuery(orderId);

//   const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
//   const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

//   const { userInfo } = useSelector((state) => state.auth);

//   const navigate = useNavigate();
//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const paymentStatus = searchParams.get('status');

//     // console.log("token: ",userInfo.token);

//     if (paymentStatus === 'PAID') { // thanh toán thành công
//       toast.success('Payment was successful');

//       console.log('Payment was successful');

//       const updateOrderToPaid = async () => {
//         try {
//           // if (!userInfo || !userInfo.token) {
//           //   throw new Error('User not authenticated');
//           // }

//           // const config = {
//           //   headers: {
//           //     'Content-Type': 'application/json',
//           //     Authorization: `Bearer ${userInfo.token}`,
//           //   },
//           // };

//           const { data } = await axios.put(`/api/orders/${orderId}/pay`);

//           console.log('Order updated:', data);

//           refetch();
//         } catch (error) {
//           console.error('Error updating payment status', error);
//           toast.error('Error updating payment status');
//         }
//       };

//       updateOrderToPaid();
//     } else if (paymentStatus === 'CANCELLED') {
//       toast.error('Payment was cancelled');
//     }
//   }, [location.search, orderId, refetch, userInfo]);

//   const goBack = () => {
//     navigate(-1);
//   };

//   const deliverHandler = async () => {
//     try {
//       await deliverOrder(orderId);
//       refetch();
//     } catch (error) {
//       console.error('Error marking order as delivered', error);
//       toast.error('Error marking order as delivered');
//     }
//   };

//   return isLoading ? (
//     <Loader />
//   ) : error ? (
//     <Message variant='danger'>{error.data.message}</Message>
//   ) : (
//     <Container>
//       <Link className='btn btn-light my-3' onClick={goBack}>Go Back</Link>
//       <h1>Order {order._id}</h1>
//       <Row>
//         <Col md={8}>
//           <ListGroup variant='flush'>
//             <ListGroup.Item>
//               <h2>Shipping</h2>
//               <p>
//                 <strong>Name: </strong> {order.user.name}
//               </p>
//               <p>
//                 <strong>Email: </strong>{' '}
//                 <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
//               </p>
//               <p>
//                 <strong>Address:</strong>
//                 {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
//                 {order.shippingAddress.postalCode}, {order.shippingAddress.country}
//               </p>
//               {order.isDelivered ? (
//                 <Message variant='success'>
//                   Delivered on {order.deliveredAt}
//                 </Message>
//               ) : (
//                 <Message variant='danger'>Not Delivered</Message>
//               )}
//             </ListGroup.Item>

//             <ListGroup.Item>
//               <h2>Payment Method</h2>
//               <p>
//                 <strong>Method: </strong>
//                 {order.paymentMethod}
//               </p>
//               {order.isPaid ? (
//                 <Message variant='success'>Paid on {order.paidAt}</Message>
//               ) : (
//                 <Message variant='danger'>Not Paid</Message>
//               )}
//             </ListGroup.Item>

//             <ListGroup.Item className="m-1">
//               <h2>Order Items</h2>
//               {order.orderItems.length === 0 ? (
//                 <Message>Order is empty</Message>
//               ) : (
//                 <ListGroup variant='flush'>
//                   {order.orderItems.map((item, index) => (
//                     <ListGroup.Item key={index}>
//                       <Row>
//                         <Col md={1}>
//                           <Image
//                             src={item.image}
//                             alt={item.name}
//                             fluid
//                             rounded
//                           />
//                         </Col>
//                         <Col>
//                           <Link to={`/product/${item.product}`}>
//                             {item.name}
//                           </Link>
//                         </Col>
//                         <Col md={4}>
//                           {item.qty} x {item.price}.000 = {item.qty * item.price}.000
//                         </Col>
//                       </Row>
//                     </ListGroup.Item>
//                   ))}
//                 </ListGroup>
//               )}
//             </ListGroup.Item>
//           </ListGroup>
//         </Col>
//         <Col md={4}>
//           <Card>
//             <ListGroup variant='flush'>
//               <ListGroup.Item>
//                 <h2>Order Summary</h2>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>Items</Col>
//                   <Col>{order.itemsPrice}.000 <small>VND</small></Col>
//                 </Row>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>Shipping</Col>
//                   <Col>{order.shippingPrice}.000 <small>VND</small></Col>
//                 </Row>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>Total</Col>
//                   <Col>{order.totalPrice}.000 <small>VND</small></Col>
//                 </Row>
//               </ListGroup.Item>
//               {!order.isPaid  && order.user._id === userInfo._id && (
//                 <ListGroup.Item>
//                   {loadingPay && <Loader />}

//                   <div>
//                     <form action="/create-payment-link" method='post'>
//                       <input type='hidden' name='orderId' value={order._id} />
//                       <input type='hidden' name='amount' value={order.totalPrice} />
//                       <Button type='submit' className='btn btn-primary'>Thanh toán bằng QRCode</Button>
//                     </form>
//                   </div>
//                 </ListGroup.Item>
//               )}

//               {loadingDeliver && <Loader />}

//               {userInfo &&
//                 userInfo.isAdmin &&
//                 order.isPaid &&
//                 !order.isDelivered && (
//                   <ListGroup.Item>
//                     <Button
//                       type='button'
//                       className='btn btn-block'
//                       onClick={deliverHandler}
//                     >
//                       Mark As Delivered
//                     </Button>
//                   </ListGroup.Item>
//                 )}
//             </ListGroup>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default OrderScreen;


import { useEffect } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';
import axios from 'axios';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const location = useLocation();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentStatus = searchParams.get('status');
  
    if (paymentStatus === 'PAID') { // thanh toán thành công
      toast.success('Payment was successful');
      console.log('Payment was successful');
  
      const updateOrderToPaid = async () => {
        try {
          const { data } = await axios.put(`/api/orders/${orderId}/pay`);
  
          console.log('Order updated:', data);
          refetch();
        } catch (error) {
          console.error('Error updating payment status', error);
          toast.error('Error updating payment status');
        }
      };
  
      updateOrderToPaid();
    } else if (paymentStatus === 'CANCELLED') {
      toast.error('Payment was cancelled');
    }
  }, [location.search, orderId, refetch, userInfo]);

  const goBack = () => {
    navigate(-1);
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
    } catch (error) {
      console.error('Error marking order as delivered', error);
      toast.error('Error marking order as delivered');
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <Container>
      <Link className='btn btn-light my-3' onClick={goBack}>Go Back</Link>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className="m-1">
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price}.000 = {item.qty * item.price}.000
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>{order.itemsPrice}.000 <small>VND</small></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{order.shippingPrice}.000 <small>VND</small></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{order.totalPrice}.000 <small>VND</small></Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid  && order.user._id === userInfo._id && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  <div>
                    <form action="/create-payment-link" method='post'>
                      <input type='hidden' name='orderId' value={order._id} />
                      <input type='hidden' name='amount' value={order.totalPrice} />
                      <Button type='submit' className='btn btn-primary'>Thanh toán bằng QRCode</Button>
                    </form>
                  </div>
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderScreen;
