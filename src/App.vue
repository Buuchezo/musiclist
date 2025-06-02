<template>
  <div class="container">
    <!-- Flag Buttons -->
    <div class="lang-switcher">
      <button @click="setLanguage('de')" :class="{ active: t.lang === 'de' }">
        <img src="https://flagcdn.com/32x24/de.png" alt="German" />
      </button>
      <button @click="setLanguage('en')" :class="{ active: t.lang === 'en' }">
        <img src="https://flagcdn.com/32x24/gb.png" alt="English" />
      </button>
    </div>
    <div class="floating-heart">❤️</div>
    <div class="floating-heart">💖</div>
    <div class="floating-heart">💖</div>
    <div class="floating-heart">💖</div>
    <div class="floating-heart">💖</div>
    <div class="floating-heart">💘</div>
    <div class="floating-heart">💕</div>

    <!-- Smooth fade transition -->
    <transition name="fade" mode="out-in">
      <h2 :key="t.lang">{{ t.title }} 🎵🎶💍💒</h2>
    </transition>

    <transition name="fade" mode="out-in">
      <p class="wedding-message" :key="t.lang + '-msg'">
        {{ t.message }}
      </p>
    </transition>

    <form @submit.prevent="submitPoem">
      <transition name="fade" mode="out-in">
        <label :key="t.lang + '-label-1'">{{ t.artistLabel }}</label>
      </transition>
      <input type="text" :placeholder="t.artistPlaceholder" v-model="enteredKunstler" />

      <transition name="fade" mode="out-in">
        <label :key="t.lang + '-label-2'">{{ t.titleLabel }}</label>
      </transition>
      <input type="text" :placeholder="t.titlePlaceholder" v-model="enteredTitel" />

      <transition name="fade" mode="out-in">
        <button :key="t.lang + '-button'">{{ t.button }}</button>
      </transition>
    </form>

    <transition name="fade">
      <p v-if="errorMessage" class="error">⚠️ {{ errorMessage }}</p>
    </transition>

    <transition name="fade">
      <p v-if="successMessage" class="success">✅ {{ successMessage }}</p>
    </transition>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  setup() {
    const enteredKunstler = ref('')
    const enteredTitel = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')
    const lang = ref('de')

    const translations = {
      de: {
        lang: 'de',
        title: 'Music Wünsche',
        message: 'Teile deinen Musikwunsch für unseren besonderen Tag 💕',
        artistLabel: 'Künstler',
        artistPlaceholder: 'Künstler name ...',
        titleLabel: 'Titel',
        titlePlaceholder: 'Musiktitel ...',
        button: 'Speichern 💖',
        error: 'Bitte fülle beide Felder aus.',
        success: 'Dein Wunsch wurde erfolgreich gespeichert! 🎶',
      },
      en: {
        lang: 'en',
        title: 'Music Wishes',
        message: 'Share your music request for our special day 💕',
        artistLabel: 'Artist',
        artistPlaceholder: 'Artist name ...',
        titleLabel: 'Title',
        titlePlaceholder: 'Song title ...',
        button: 'Save 💖',
        error: 'Please fill in both fields.',
        success: 'Your wish was successfully saved! 🎶',
      },
    }

    const t = computed(() => translations[lang.value])

    const setLanguage = (newLang) => {
      lang.value = newLang
      // Clear messages when language changes
      errorMessage.value = ''
      successMessage.value = ''
    }

    const submitPoem = async () => {
      errorMessage.value = ''
      successMessage.value = ''

      if (!enteredKunstler.value.trim() || !enteredTitel.value.trim()) {
        errorMessage.value = t.value.error
        return
      }

      try {
        await fetch('https://music-list-cadfa-default-rtdb.firebaseio.com/songs.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            enteredKunstler: enteredKunstler.value,
            enteredTitel: enteredTitel.value,
          }),
        })
        successMessage.value = t.value.success
        enteredKunstler.value = ''
        enteredTitel.value = ''
      } catch {
        errorMessage.value =
          lang.value === 'de' ? 'Fehler beim Speichern.' : 'An error occurred while saving.'
      }
    }

    return {
      enteredKunstler,
      enteredTitel,
      errorMessage,
      successMessage,
      t,
      submitPoem,
      setLanguage,
    }
  },
})
</script>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(to bottom, #fff0f5, #ffe4e1);
  padding: 2rem;
}

.container {
  max-width: 500px;
  margin: 5rem auto;
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(255, 182, 193, 0.5);
  text-align: center;
}

.lang-switcher {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.lang-switcher button {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
}

h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #c71585;
  margin-bottom: 0.5rem;
}

.wedding-message {
  font-size: 1.2rem;
  color: #800000;
  margin-bottom: 1.5rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-size: 1.3rem;
  font-weight: bold;
  color: #8b0000;
  text-align: left;
}

input {
  border: 1px solid #d8bfd8 !important;
  height: 3rem;
  padding-left: 1rem;
  background: #fffafc !important;
  border-radius: 1rem !important;
  font-size: 1rem;
}

button {
  border: none;
  background-color: #ff69b4 !important;
  color: white !important;
  font-weight: bold !important;
  font-size: 1.2rem !important;
  height: 3rem;
  border-radius: 2rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #ff85c1 !important	;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}

.success {
  color: green;
  font-weight: bold;
  margin-top: 1rem;
}

.lang-switcher {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.lang-switcher button {
  background: none !important;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.lang-switcher button:hover {
  transform: scale(1.2);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes romanticBackground {
  0% {
    background-color: #fff0f5 !important; /* lavender blush */
  }
  25% {
    background-color: #ffe4e1 !important; /* misty rose */
  }
  50% {
    background-color: #fffaf0 !important; /* floral white */
  }
  75% {
    background-color: #f0fff0 !important; /* honeydew */
  }
  100% {
    background-color: #fff0f5 !important; /* back to start */
  }
}

body {
  animation: romanticBackground 60s infinite alternate ease-in-out;
  transition: background-color 100s ease;
}

/* .lang-switcher .active {
  filter: drop-shadow(0 0 4px #ff69b4);
} */
</style>
