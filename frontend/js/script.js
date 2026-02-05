document.addEventListener('DOMContentLoaded', () => {
    const originalTextarea = document.getElementById('original-text');
    const convertedTextarea = document.getElementById('converted-text');
    const convertButton = document.getElementById('convert-button');
    const copyButton = document.getElementById('copy-button');
    const charCountSpan = document.getElementById('current-char-count');
    const feedbackMessageDiv = document.getElementById('feedback-message');
    const targetRadios = document.querySelectorAll('input[name="target"]');
    const feedbackButtons = document.querySelectorAll('.feedback-btn');

    // FR-04: 실시간 글자 수 표시
    originalTextarea.addEventListener('input', () => {
        charCountSpan.textContent = originalTextarea.value.length;
    });

    // FR-01: 핵심 말투 변환 기능
    convertButton.addEventListener('click', async () => {
        const originalText = originalTextarea.value;
        const selectedTarget = Array.from(targetRadios).find(radio => radio.checked)?.value;

        if (!originalText) {
            showFeedback('변환할 텍스트를 입력해주세요.', 'error');
            return;
        }
        if (!selectedTarget) {
            showFeedback('변환 대상을 선택해주세요.', 'error');
            return;
        }

        convertButton.disabled = true;
        convertButton.textContent = '변환 중...';
        showFeedback('', ''); // Clear previous feedback

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = { ok: true, json: () => Promise.resolve({ converted_text: `[${selectedTarget}에게 보낼 변환된 텍스트] ${originalText}` }) };
            // 실제 API 호출 로직
            // const response = await fetch('/api/convert', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ text: originalText, target: selectedTarget }),
            // });

            const data = await response.json();

            if (response.ok) {
                convertedTextarea.value = data.converted_text;
                showFeedback('텍스트 변환 성공!', 'success');
            } else {
                // FR-05: 오류 처리
                showFeedback(data.error || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
                convertedTextarea.value = '변환 실패.';
            }
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            // FR-05: 오류 처리
            showFeedback('API 호출 중 문제가 발생했습니다. 네트워크를 확인하거나 잠시 후 다시 시도해주세요.', 'error');
            convertedTextarea.value = '변환 실패.';
        } finally {
            convertButton.disabled = false;
            convertButton.textContent = '변환하기';
        }
    });

    // FR-03: 결과 활용 (복사하기)
    copyButton.addEventListener('click', () => {
        if (convertedTextarea.value) {
            navigator.clipboard.writeText(convertedTextarea.value).then(() => {
                showFeedback('변환된 텍스트가 클립보드에 복사되었습니다!', 'success');
            }).catch(err => {
                console.error('클립보드 복사 실패:', err);
                showFeedback('텍스트 복사에 실패했습니다.', 'error');
            });
        } else {
            showFeedback('복사할 내용이 없습니다.', 'error');
        }
    });

    // 피드백 메시지 표시 함수
    function showFeedback(message, type) {
        feedbackMessageDiv.textContent = message;
        // Base classes that are always present
        const baseClasses = ['text-center', 'mt-4', 'p-2.5', 'rounded-md', 'text-sm'];
        feedbackMessageDiv.className = baseClasses.join(' ');

        if (message) {
            if (type === 'success') {
                feedbackMessageDiv.classList.add('bg-green-100', 'text-green-700');
            } else if (type === 'error') {
                feedbackMessageDiv.classList.add('bg-red-100', 'text-red-700');
            }
            feedbackMessageDiv.style.display = 'block';
        } else {
            feedbackMessageDiv.style.display = 'none';
        }
    }
    
    // FR-06: 사용자 피드백 버튼 처리
    feedbackButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Clear selection from all buttons
            feedbackButtons.forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            // Select the clicked button
            button.classList.remove('bg-gray-200', 'text-gray-700');
            button.classList.add('bg-blue-600', 'text-white');

            // Optional: Log feedback to the console or send to a server
            console.log(`User feedback: ${button.dataset.feedback}`);
        });
    });


    // 초기 글자 수 설정
    charCountSpan.textContent = originalTextarea.value.length;
});