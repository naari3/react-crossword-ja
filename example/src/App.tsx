import React, { useCallback, useEffect, useRef, useState } from 'react';
import Crossword, {
  CrosswordImperative,
  CrosswordGrid,
  CrosswordProvider,
  CrosswordProviderImperative,
  DirectionClues,
  AnswerTuple,
} from '@naari3/react-crossword-ja';
import styled from 'styled-components';

const data = {
  across: {
    1: {
      clue: 'apple',
      answer: 'りんご',
      row: 0,
      col: 0,
    },
  },
  down: {
    2: {
      clue: 'gorilla',
      answer: 'ごりら',
      row: 0,
      col: 2,
    },
  },
};

const Page = styled.div`
  padding: 2em;
`;

const Header = styled.h1`
  margin-bottom: 1em;
`;

const Commands = styled.div``;

const Command = styled.button`
  margin-right: 1em;
`;

const CrosswordMessageBlock = styled.div`
  margin: 2em 0 4em;
  display: flex;
  gap: 2em;
  max-height: 20em;
`;

const CrosswordWrapper = styled.div`
  max-width: 30em;

  /* and some fun making use of the defined class names */
  .crossword.correct {
    rect {
      stroke: rgb(100, 200, 100) !important;
    }
    svg > rect {
      fill: rgb(100, 200, 100) !important;
    }
    text {
      fill: rgb(100, 200, 100) !important;
    }
  }

  .clue.correct {
    ::before {
      content: '\u2713'; /* a.k.a. checkmark: ✓ */
      display: inline-block;
      text-decoration: none;
      color: rgb(100, 200, 100);
      margin-right: 0.25em;
    }

    text-decoration: line-through;
    color: rgb(130, 130, 130);
  }
`;

const CrosswordProviderWrapper = styled(CrosswordWrapper)`
  max-width: 50em;
  display: flex;
  gap: 1em;

  .direction {
    width: 10em;

    .header {
      margin-top: 0;
    }
  }

  .grid {
    width: 10em;
  }
`;

const Messages = styled.pre`
  flex: auto;
  background-color: rgb(230, 230, 230);
  margin: 0;
  padding: 1em;
  overflow: auto;
`;

// in order to make this a more-comprehensive example, and to vet Crossword's
// features, we actually implement a fair amount...

function App() {
  const crossword = useRef<CrosswordImperative>(null);

  const focus = useCallback((event) => {
    crossword.current?.focus();
  }, []);

  const fillOneCell = useCallback((event) => {
    crossword.current?.setGuess(0, 2, 'ご');
  }, []);

  const fillAllAnswers = useCallback((event) => {
    crossword.current?.fillAllAnswers();
  }, []);

  const reset = useCallback((event) => {
    crossword.current?.reset();
  }, []);

  // We don't really *do* anything with callbacks from the Crossword component,
  // but we can at least show that they are happening.  You would want to do
  // something more interesting than simply collecting them as messages.
  const messagesRef = useRef<HTMLPreElement>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const clearMessages = useCallback((event) => {
    setMessages([]);
  }, []);

  const addMessage = useCallback((message: string) => {
    setMessages((m) => m.concat(`${message}\n`));
  }, []);

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }
    const { scrollHeight } = messagesRef.current;
    messagesRef.current.scrollTo(0, scrollHeight);
  }, [messages]);

  // onCorrect is called with the direction, number, and the correct answer.
  const onCorrect = useCallback(
    (direction, number, answer) => {
      addMessage(`onCorrect: "${direction}", "${number}", "${answer}"`);
    },
    [addMessage]
  );

  // onLoadedCorrect is called with an array of the already-correct answers,
  // each element itself is an array with the same values as in onCorrect: the
  // direction, number, and the correct answer.
  const onLoadedCorrect = useCallback(
    (answers: AnswerTuple[]) => {
      addMessage(
        `onLoadedCorrect:\n${answers
          .map(
            ([direction, number, answer]) =>
              `    - "${direction}", "${number}", "${answer}"`
          )
          .join('\n')}`
      );
    },
    [addMessage]
  );

  // onCrosswordCorrect is called with a truthy/falsy value.
  const onCrosswordCorrect = useCallback(
    (isCorrect: boolean) => {
      addMessage(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
    },
    [addMessage]
  );

  // onCellChange is called with the row, column, and character.
  const onCellChange = useCallback(
    (row: number, col: number, char: string) => {
      addMessage(`onCellChange: "${row}", "${col}", "${char}"`);
    },
    [addMessage]
  );

  // all the same functionality, but for the decomposed CrosswordProvider
  const crosswordProvider = useRef<CrosswordProviderImperative>(null);

  const focusProvider = useCallback((event) => {
    crosswordProvider.current?.focus();
  }, []);

  const fillOneCellProvider = useCallback((event) => {
    crosswordProvider.current?.setGuess(0, 2, 'O');
  }, []);

  const fillAllAnswersProvider = useCallback((event) => {
    crosswordProvider.current?.fillAllAnswers();
  }, []);

  const resetProvider = useCallback((event) => {
    crosswordProvider.current?.reset();
  }, []);

  // We don't really *do* anything with callbacks from the Crossword component,
  // but we can at least show that they are happening.  You would want to do
  // something more interesting than simply collecting them as messages.
  const messagesProviderRef = useRef<HTMLPreElement>(null);
  const [messagesProvider, setMessagesProvider] = useState<string[]>([]);

  const clearMessagesProvider = useCallback((event) => {
    setMessagesProvider([]);
  }, []);

  const addMessageProvider = useCallback((message: string) => {
    setMessagesProvider((m) => m.concat(`${message}\n`));
  }, []);

  useEffect(() => {
    if (!messagesProviderRef.current) {
      return;
    }
    const { scrollHeight } = messagesProviderRef.current;
    messagesProviderRef.current.scrollTo(0, scrollHeight);
  }, [messagesProvider]);

  // onCorrect is called with the direction, number, and the correct answer.
  const onCorrectProvider = useCallback(
    (direction, number, answer) => {
      addMessageProvider(`onCorrect: "${direction}", "${number}", "${answer}"`);
    },
    [addMessageProvider]
  );

  // onLoadedCorrect is called with an array of the already-correct answers,
  // each element itself is an array with the same values as in onCorrect: the
  // direction, number, and the correct answer.
  const onLoadedCorrectProvider = useCallback(
    (answers: AnswerTuple[]) => {
      addMessageProvider(
        `onLoadedCorrect:\n${answers
          .map(
            ([direction, number, answer]) =>
              `    - "${direction}", "${number}", "${answer}"`
          )
          .join('\n')}`
      );
    },
    [addMessageProvider]
  );

  // onCrosswordCorrect is called with a truthy/falsy value.
  const onCrosswordCorrectProvider = useCallback(
    (isCorrect: boolean) => {
      addMessageProvider(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
    },
    [addMessageProvider]
  );

  // onCellChange is called with the row, column, and character.
  const onCellChangeProvider = useCallback(
    (row: number, col: number, char: string) => {
      addMessageProvider(`onCellChange: "${row}", "${col}", "${char}"`);
    },
    [addMessageProvider]
  );

  return (
    <Page>
      <Header>@naari3/react-crossword-ja example app</Header>

      <p>
        This is a demo app that makes use of the @naari3/react-crossword-ja
        component. It excersizes most of the functionality, so that you can see
        how to do so.
      </p>

      <Commands>
        <Command onClick={focus}>Focus</Command>
        <Command onClick={fillOneCell}>Fill the first letter of 2-down</Command>
        <Command onClick={fillAllAnswers}>Fill all answers</Command>
        <Command onClick={reset}>Reset</Command>
        <Command onClick={clearMessages}>Clear messages</Command>
      </Commands>

      <CrosswordMessageBlock>
        <CrosswordWrapper>
          <Crossword
            ref={crossword}
            data={data}
            onCorrect={onCorrect}
            onLoadedCorrect={onLoadedCorrect}
            onCrosswordCorrect={onCrosswordCorrect}
            onCellChange={onCellChange}
          />
        </CrosswordWrapper>

        <Messages ref={messagesRef}>{messages}</Messages>
      </CrosswordMessageBlock>

      <p>
        And here’s a decomposed version, showing more control of the individual
        components (intended for specific layout needs).
      </p>

      <Commands>
        <Command onClick={focusProvider}>Focus</Command>
        <Command onClick={fillOneCellProvider}>
          Fill the first letter of 2-down
        </Command>
        <Command onClick={fillAllAnswersProvider}>Fill all answers</Command>
        <Command onClick={resetProvider}>Reset</Command>
        <Command onClick={clearMessagesProvider}>Clear messages</Command>
      </Commands>

      <CrosswordMessageBlock>
        <CrosswordProviderWrapper>
          <CrosswordProvider
            ref={crosswordProvider}
            data={data}
            onCorrect={onCorrectProvider}
            onLoadedCorrect={onLoadedCorrectProvider}
            onCrosswordCorrect={onCrosswordCorrectProvider}
            onCellChange={onCellChangeProvider}
          >
            <DirectionClues direction="across" />
            <CrosswordGrid />
            <DirectionClues direction="down" />
          </CrosswordProvider>
        </CrosswordProviderWrapper>

        <Messages ref={messagesProviderRef}>{messagesProvider}</Messages>
      </CrosswordMessageBlock>
    </Page>
  );
}

export default App;
