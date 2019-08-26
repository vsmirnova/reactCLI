# generate-react-create-app

Приложение, которое гененрирует стартовый шаблон приложения с router, redux, saga.
<br>
Также может создавать новые компоненты и redux-модули.
<br>
## Install

Run

>```npm install -g initial-react-app```

## Зачем?

1. Каждый раз, когда запускаешь проект, необходим router, redux, saga
2. Создание компонентов занимает много времени.

Приложение умеет создавать [функциональные и классовые компоненты](https://ru.reactjs.org/docs/components-and-props.html#function-and-class-components) :

Functional Component:


```javascript
import React, {Component} from 'react';
import PropTypes from 'prop-types';

const Comp = () => {
  return (
    <div className="Comp">
    </div>
  )
}
Comp.propTypes = {
}

export default Comp;
```

Class Component:

```javascript
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Comp extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="Comp">

      </div>
    )
  }
}
Comp.propTypes = {
}

export default Comp;
```

### Инициализация проекта

Run

>```rcli init <ProjectName>```

Это приведет к созданию проекта следующей структуры : <br>
```
project
└─ node_modules
└─ public
└─ src
│   └─ components
│   └─ containers
│   │   │ App.jsx
│   │   │ Test.jsx
│   └─ ducks
│   │   │ test.js
│   └─ router
│   │   │ index.js
│   │   │ links.js
│   │   │ privateRouter.js
│   └─ store
│   │   │ configureStore.js
│   │   │ reducer.js
│   │   │ saga.js
│   │ index.js
│ .gitignore
│ package.json
│ package-lock.json
│ README.md
```
### Создание компонента
Run
>```rcli createComp <ComponentName>```

Создаст папку с именем компонента и файл компонент с именем index.jsx

#### Опции

Создание функционального компонента
>```rcli createComp <ComponentName> -F``` <b>or</b> ```rcli createComp <ComponentName> --functional```

Создание компонента подключенного к redux
>```rcli createComp <ComponentName> -C``` <b>or</b> ```rcli createComp <ComponentName> --connect```

Создание компонента контейнера
>```rcli createComp <ComponentName> -P``` <b>or</b> ```rcli createComp <ComponentName> --page```

<br>

### Создание модуля Redux

Run
>```rcli createDuck <ModuleName>```

Создаст модуль в папке ducks и подключит его в src/store/reducer.js и  src/store/saga.js
