import { describe, expect, it } from 'vitest';
import { transform } from '../src/plugins/webpack/addHOC';

const text = `import { Inspector } from 'react-dev-inspector-enhanced';

export const HomePage = () => {
  return (
    <Inspector
      HOC={{
        name: 'Log',
        importCode: "import { Log } from './components/Log';",
      }}
      keys={{
        gotoEditor: ['shift', 'command', 's'],
        addHOC: ['command', 'shift', 'l'],
      }}>
      <div>
        <div>
          father
          <div>test1</div>
          <div>test2</div>
          <div>test3</div>
        </div>
      </div>
    </Inspector>
  );
  // return <div>test</div>;
};

export default HomePage;
`;

describe('should transform correct', () => {
  it('when Log has not imported 1', () => {
    const res = transform({
      text,
      componentName: 'Log',
      importCode: `import { Log } from './components/Log';`,
      lineNumber: 5,
      colNumber: 4,
    });
    expect(res).toMatchInlineSnapshot(`
      "import { Log } from './components/Log';
      import { Inspector } from 'react-dev-inspector-enhanced';

      export const HomePage = () => {
        return (
          <Log><Inspector
            HOC={{
              name: 'Log',
              importCode: \\"import { Log } from './components/Log';\\",
            }}
            keys={{
              gotoEditor: ['shift', 'command', 's'],
              addHOC: ['command', 'shift', 'l'],
            }}>
            <div>
              <div>
                father
                <div>test1</div>
                <div>test2</div>
                <div>test3</div>
              </div>
            </div>
          </Inspector></Log>
        );
        // return <div>test</div>;
      };

      export default HomePage;
      "
    `);
  });
  it('when Log has not imported 2', () => {
    const res = transform({
      text,
      componentName: 'Log',
      importCode: `import { Log } from './components/Log';`,
      lineNumber: 17,
      colNumber: 10,
    });
    expect(res).toMatchInlineSnapshot(`
      "import { Log } from './components/Log';
      import { Inspector } from 'react-dev-inspector-enhanced';

      export const HomePage = () => {
        return (
          <Inspector
            HOC={{
              name: 'Log',
              importCode: \\"import { Log } from './components/Log';\\",
            }}
            keys={{
              gotoEditor: ['shift', 'command', 's'],
              addHOC: ['command', 'shift', 'l'],
            }}>
            <div>
              <div>
                father
                <Log><div>test1</div></Log>
                <div>test2</div>
                <div>test3</div>
              </div>
            </div>
          </Inspector>
        );
        // return <div>test</div>;
      };

      export default HomePage;
      "
    `);
  });
  it('should not import twice when Log has been imported', () => {
    const res = transform({
      text: `import { Log } from './components/Log';\n` + text,
      componentName: 'Log',
      importCode: `import { Log } from './components/Log';`,
      lineNumber: 6,
      colNumber: 4,
    });
    expect(res).toMatchInlineSnapshot(`
      "import { Log } from './components/Log';
      import { Inspector } from 'react-dev-inspector-enhanced';

      export const HomePage = () => {
        return (
          <Log><Inspector
            HOC={{
              name: 'Log',
              importCode: \\"import { Log } from './components/Log';\\",
            }}
            keys={{
              gotoEditor: ['shift', 'command', 's'],
              addHOC: ['command', 'shift', 'l'],
            }}>
            <div>
              <div>
                father
                <div>test1</div>
                <div>test2</div>
                <div>test3</div>
              </div>
            </div>
          </Inspector></Log>
        );
        // return <div>test</div>;
      };

      export default HomePage;
      "
    `);
  });
  it('should not transform when Log is a child', () => {
    const res = transform({
      text: '<Log><div>test</div></Log>',
      componentName: 'Log',
      importCode: `import { Log } from './components/Log';`,
      lineNumber: 1,
      colNumber: 0,
    });
    expect(res).toMatchInlineSnapshot('false');
  });
});
