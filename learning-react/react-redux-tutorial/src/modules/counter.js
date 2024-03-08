import {createAction, handleActions} from 'redux-actions';

// 액션 타입 정의하기
const INCREASE = 'counter/INCERASE';
const DECREASE = 'counter/DECREASE';

// 액션 생성 함수 만들기
// export const increase = () => ({type: INCREASE});
// export const decrease = () => ({type: DECREASE});

// redux-actions의 createAction 함수를 활용하여 액션 생성 함수 만들기
export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

// 초기 상태
const initialState = {
  number: 0
}

// 리듀서 함수 (현재 상태를 참조하여 새로운 객체를 생성해서 반환)
// function counter(state = initialState, action) {
//   switch (action.type) {
//     case INCREASE:
//       return {
//         number: state.number + 1
//       };
//     case DECREASE:
//       return {
//         number: state.number - 1
//       }
//     default:
//       return state;
//   }
// }

// react-actions의 handleActions함수를 활용한 리듀서 함수
const counter = handleActions(
  {
    [INCREASE]: (state, action) => ({number: state.number + 1}),
    [DECREASE]: (state, action) => ({number: state.number - 1}),
  },
  initialState,
)

export default counter;