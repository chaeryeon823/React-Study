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

### 17.6.1 redux-actions

액션 생성 함수, 리듀서를 작성할 때 redux-actions 라는 라이브러리와 이전에 배웠던 immer 라이브러리를 활용하면 리덕스를 훨씬 편하게 사용할 수 있다.

````
// 액션 생성 함수 만들기
export const increase = () => ({type: INCREASE});
export const decrease = () => ({type: DECREASE});

// redux-actions의 createAction 함수를 활용하여 액션 생성 함수 만들기
export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);
``````

```
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

// react-actions의 handleActions함수를 활용한 리듀서 함수
const counter = handleAction(
  {
    [INCREASE]: (state, action) => ({number: state.number + 1}),
    [DECREASE]: (state, action) => ({number: state.number - 1}),
  },
  initialState,
)
```

```
export const insert = text => ({
  type: INSERT,
  todo: {
    id: id++,
    text,
    done: false
  }
});

export const insert = createAction(INSERT, (text) => ({
  id: id++,
  text,
  done: false,
}));
```
- createAction으로 액션을 만들면 액션에 필요한 추가 데이터는 payload라는 이름을 사용한다.
- 액션 생성 함수에서 받아온 파라미터를 그대로 payload에 넣는 것이 아니라, 변형을 주어서 넣고 싶다면, createAction의 두 번째 함수에 payload를 정의한느 함수를 따로 선언해 주면 된다.
- insert의 경우, todo 객체를 액션 객체 안에 넣어주어야 하기 때문에 두 번째 파라미터에 text를 넣으면 todo 객체가 반환되는 함수를 넣어주었다.

```
function todos(state = initialState, action) {
  switch (action.type) {
    case CHANGE_INPUT:
      return {
        ...state,
        input: action.input,
      };

    case INSERT:
      return {
        ...state,
        todos: state.todos.concat(action.todo),
      };

    case TOGGLE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, done: !todo.done } : todo,
        ),
      };

    case REMOVE:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };

    default:
      return state;
  }
}

const todos = handleAction({
  [CHANGE_INPUT]: (state, {payload : input}) => ({ ...state, input: input }),
  [INSERT]: (state, {payload : todo}) => ({
    ...state,
    todos: state.todos.concat(todo),
  }),
  [TOGGLE]: (state, {payload : id}) => ({
    ...state,
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo,
    ),
  }),
  [REMOVE]: (state, {payload : id}) => ({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== id),
  }),
},
initialState,
);

```

- createAction으로 만든 액션 생성 함수는 파라미터로 받아 온 값을 객체 안에 넣을 때 원하는 이름으로 넣는 것이 아니라 action.id, action.todo와 같이 action.payload라는 이름을 공통적으로 넣어준다. 따라 action.payload 값을 조회하여 업데이터 하도록 구현해야 한다.
- 모든 추가 데이터 값을 action.payload로 사용하기 때문에 코드가 헷갈릴 수 있다. 따라 객체 비구조화 할당 문법으로 action 값의 payload 이름을 새로 설정해준다.

### 17.6.2 immer
리듀서에서 상태를 업데이트할 때는 불변서을 지켜야 하기 때문에 spread연산자와 배열의 내장함수를 사용했다. 그러나 모듈의 상태가 복잡해질수록 불변성을 지키기가 까다로워진다.
  
객체의 구조가 복잡해지거나 객체로 이루어진 배열을 다룰 경우, immer를 사용하면 훨씬 편리하게 상태를 관리할 수 있다.

```
const todos = handleAction(
  {
    [CHANGE_INPUT]: (state, { payload: input }) =>
      produce(state, (draft) => {
        draft.input = input;
      }),
    [INSERT]: (state, { payload: todo }) => 
      produce(state, draft => {
        draft.todos.push(todo);
      }),
    [TOGGLE]: (state, { payload: id }) => produce(state, draft => {
      const todo = draft.todos.find(todo => todo.id === id);
      todo.done = !todo.done;
      }),
    [REMOVE]: (state, { payload: id }) => produce(state, draft => {
      const index = draft.todos.findIndex(todo => todo.id === id);
      draft.todos.splice(index, 1);
    })
  },
  initialState,
);
```

## 17.7 Hooks를 사용하여 컨테이너 컴포넌트 만들기

리덕스 스토어와 연동된 컨테이너 컴포넌트를 만들 때 connect함수를 사용하는 대신 react-redux에서 제공하는 Hooks를 사용할 수도 있다.

```
import Counter from '../components/Counter';
import { connect } from 'react-redux';
import { decrease, increase } from '../modules/counter';
import { useSelector, useDispatch } from 'react-redux';

// const CounterContainer = ({ number, increase, decrease }) => {
  const CounterConatainer = () => {
  const number = useSelector((state) => state.counter.number);
  const dispatch = useDispatch();
  return (
    // <Counter number={number} onIncrease={increase} onDecrease={decrease} />
    <Counter
      number={number}
      onIncrease={() => dispatch(increase())}
      onDecrease={() => dispatch(decrease())}
    />
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

export default CounterConatainer;
```

useSelector와 useDispatch를 활용하여 연동한다.

```
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
```

컴포넌트 성능을 최적화해야 하는 상황이 온다면 useCallback으로 액션을 디스패치하는 함수를 감싸주는 것이 좋다.

```
const dispatch = useDispatch();
  const onChangeInput = useCallback(
    (input) => dispatch(changeInput(input)),
    [dispatch],
  );
  const onInsert = useCallback((text) => dispatch(insert(text)), [dispatch]);
  const onToggle = useCallback((id) => dispatch(toggle(id)), [dispatch]);
  const onRemove = useCallback((id) => dispatch(remove(id)), [dispatch]);

  const [onChangeInput, onInsert, onToggle, onRemove] = useActions([changeInput, insert, toggle, remove], [])
```
 - 액션의 종류가 많은 경우, 일일이 명시해 주어야 하는 것이 번거러울 수 있음. 따라 useActions라는 훅을 만들어서 사용한다.
 - useActions 훅은 액션 생성 함수를 액션을 디스패치하는 함수로 변환해준다. 액션 생성 함수를 사용하여 액션 객체를 만들고, 이를 스토어에 디스패치 하는 작업을 해주는 함수를 자동으로 만드는 것이다.


### connect 함수와 Hooks 사용의 차이점

connect함수를 사용하여 컨테이너 컴포넌트를 만들었을 경우, 해당 컨테이너의 부모 컴포넌트가 리렌더링될 때 해당 컨테이너 컴포넌트의 props가 바뀌지 않았다면 리렌더링이 자동으로 방지되어 성능이 최적화 된다. 반면 useSelector를 사용하여 리덕스 상태를 조회했을 때는 이 최적화 작업이 이루어지지 않으므로, 성능 최적화를 위해서는 React.memo를 컨테이너 컴포넌트에 사용해야 한다.

