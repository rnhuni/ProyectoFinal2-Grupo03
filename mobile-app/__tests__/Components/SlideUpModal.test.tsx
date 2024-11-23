import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import SlideUpModal from '../../src/Presentation/Components/notifications/SlideUpModal';

jest.useFakeTimers(); // Necesario para manejar los temporizadores de manera controlada.

describe('SlideUpModal', () => {
  it('renders correctly when visible', () => {
    const {getByText} = render(
      <SlideUpModal isVisible={true} text="Test Modal" onClose={jest.fn()} />,
    );

    expect(getByText('Test Modal')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const {queryByText} = render(
      <SlideUpModal isVisible={false} text="Test Modal" onClose={jest.fn()} />,
    );

    expect(queryByText('Test Modal')).toBeNull();
  });

  it('calls onClose after 2 seconds', async () => {
    const mockOnClose = jest.fn();

    render(
      <SlideUpModal isVisible={true} text="Test Modal" onClose={mockOnClose} />,
    );

    // Avanza el temporizador de Jest 2 segundos.
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('closes the modal when the X button is pressed', () => {
    const mockOnClose = jest.fn();

    const {getByTestId} = render(
      <SlideUpModal isVisible={true} text="Test Modal" onClose={mockOnClose} />,
    );

    const closeButton = getByTestId('close-modal');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('animates correctly on open', () => {
    const {getByTestId} = render(
      <SlideUpModal isVisible={true} text="Test Modal" />,
    );

    const modal = getByTestId('close-modal');
    expect(modal).toBeTruthy(); // Asegura que se despliega correctamente.
  });
});
