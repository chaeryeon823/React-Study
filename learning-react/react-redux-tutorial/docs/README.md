# 17장. 리덕스를 사용하여 리액트 애플리케이션 상태 관리하기
## 17.1 작업 환경 설정

react-redux 라이브러리 설치하기
```
yarn add redux react-redux
```
<br/>

## 17.2 UI 준비하기
리액트 프로젝트에서 리덕스를 사용할 때 가장 많이 사용하는 패턴은 **프레젠테이셔널 컴포넌트**와 **컨테이너 컴포넌트**를 분리하는 것이다. 

- **프레젠테이셔널 컴포넌트**란, 주로 상태 관리가 이루어지지 않고, 그저 props를 받아 와서 화면 UI를 보여 주기만 하는 컴포넌트를 말한다.

- **컨테이너 컴포넌트**는 리덕스와 연동되어 있는 컴포넌트로, 리덕스로부터 상태를 받아 오기도 하고 리덕스 스토어에 액션을 디스패치하기도 한다.

- 패턴은 리덕스를 사용하는 데 필수 사항은 아니지만, 코드의 재사용성도 높아지고, 관심사의 분리가 이루어져 UI를 작성할 때 좀 더 집중할 수 있다.

## 17.3 리덕스 관련 코드 작성하기

- 리덕스 코드 구조는 일반적으로 actions, constants, reducers 라는 세 개의 디렉터리를 만들고 그 안에 기능별로 파일을 하나씩 만드는 방식이다.

- 액션 타입, 액션 생성 함수, 리듀서 함수를 기능별로 파일 하나에 몰아서 다 작성하는 방식을 **Ducks패턴**이라고 부른다.

### 액션 타입 정의하기

```
const INCREASE = 'counter/INCERASE';
const DECREASE = 'counter/DECREASE';
```
액션 타입은 대문자로 정의하고, 문자열 내용은 **'모듈 이름/액션이름'** 과 같은 형태로 작성한다.

### 액션 생성 함수 만들기

```
export const increase = () => ({type: INCREASE});
export const decrease = () => ({type: DECREASE});
```

### 초기 상태 및 리듀서 함수 만들기
```
// 초기 상태
const initialState = {
  number: 0
}

// 리듀서 함수 (현재 상태를 참조하여 새로운 객체를 생성해서 반환)
function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return {
        number: state.number + 1
      };
    case DECREASE:
      return {
        number: state.number - 1
      }
    default:
      return state;
  }
}

export default counter;
```

### 루트 리듀서 만들기
리듀서를 여러 개 만든 경우, 나중에 createStore 함수를 사용하여 스토어를 만들 때는 리듀서를 하나만 사용해야 한다. 따라 기존에 만들었던 리듀서를 하나로 합쳐야 한다. 이 작업은 리덕스에서 제공하는 **combineReducers**라는 유틸 함수를 사용하면 쉽게 처리할 수 있다.

```
import {combineReducers} from 'redux';
import counter from './counter';
import todos from './todos';

const rootReducer = combineReducers({
  counter,
  todos,
});

export default rootReducer;
```

## 17.4 리액트 애플리케이션에 리덕스 적용하기

### Provider 컴포넌트를 사용하여 프로젝트에 리덕스 적용하기
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import './index.css';
import App from './App';
import rootReducer from './modules';


const store = createStore(rootReducer, composeWithDevTools());
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  </React.StrictMode>
);
```

## 17.5 컨테이너 컴포넌트 만들기

리덕스와 연동하려면 react-redux 에서 제공하는 connect 함수를 사용해야 한다.

```
connet(mapStateToProps, mapDispatchToProps)(연동할 컴포넌트)
```

- mapStateToProps는 리덕스 스토어 안의 상태를 컴포넌트의 props로 넘겨주기 위해 설정하는 함수
- mapDispatchToProps는 액션 생성 함수를 컴포넌트의 props로 넘겨주기 위해 사용하는 함수
- connect 함수를 호출하고 나면 또 다른 함수를 반환한다. 반환된 함수에 컴포넌트를 파라미터로 넣어주면 리덕스와 연동된 컴포넌트가 만들어진다.

````
import Counter from '../components/Counter';
import { connect } from 'react-redux'

const CounterContainer = ({number, increase, decrease}) => {
  return (
    <Counter number={number} onIncrease={increase} onDecrease={decrease} />
  );
};

const mapStateToProps = state => ({
  number: state.counter.number,
});

const mapDispatchToProps = dispatch => ({
  increase: () => {
    console.log("increase");
  },
  decrease: () => {
    console.log("decrease");
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);

``````

`````
export default connect(
  state => ({
    number: state.counter.number,
  }),
  dispatch => ({
    increase: () => dispatch(increase()),
    decrease: ()=> dispatch(decrease()),
  }),
)(CounterContainer);
``````

컴포넌트에서 액션을 디스패치 하기 위해 각 액션 생성 함수를 호출하고 dispatch로 감싸는 작업이 조금 번거로울 수 있다.
이와 같은 경우 리덕스에서 제공하는 **bindActionCreators** 유틸 함수를 사용하자.


```
export default connect(
  state => ({
    number: state.counter.number,
  }),
  dispatch => 
    bindActionCreators(
      {
        increase,
        decrease,
      },
      dispatch,
    ),
)(CounterContainer);
```
두 번째 파라미터를 아예 객체 형태로 넣어주면 connect함수가 내부적으로 bindActionCreators 작업을 대신 해준다.

```
import Counter from '../components/Counter';
import { connect } from 'react-redux'
import { decrease, increase } from '../modules/counter';
const CounterContainer = ({number, increase, decrease}) => {
  return (
    <Counter number={number} onIncrease={increase} onDecrease={decrease} />
  );
};

export default connect(
  state => ({
    number: state.counter.number,
  }),
  {
    increase,
    decrease,
  }
)(CounterContainer);

```

## 17.6 리덕스 더 편하게 사용하기
액션 생성 함수, 리듀서를 작성할 때 redux-actions 라는 라이브러리와 이전에 배웠던 immer 라이브러리를 활용하면 리덕스를 훨씬 편하게 사용할 수 있다.

