import Counter from '../components/Counter';
import { connect } from 'react-redux';
import { decrease, increase } from '../modules/counter';
import { useSelector, useDispatch } from 'react-redux';
import React, {useCallback} from 'react';
// const CounterContainer = ({ number, increase, decrease }) => {
  const CounterContainer = () => {
  const number = useSelector((state) => state.counter.number);
  const dispatch = useDispatch();
  const onIncrease = useCallback(() => dispatch(increase()), [dispatch]);
  const onDecrease = useCallback(() => dispatch(decrease()), [dispatch]);
  return (
    <Counter number={number} onIncrease={onIncrease} onDecrease={onDecrease} />
    // <Counter
    //   number={number}
    //   onIncrease={() => dispatch(increase())}
    //   onDecrease={() => dispatch(decrease())}
    // />
  );
};

// export default connect(
//   state => ({
//     number: state.counter.number,
//   }),
//   {
//     increase,
//     decrease,
//   }
// )(CounterContainer);

export default CounterContainer;