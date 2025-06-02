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

    <!-- Smooth fade transition -->
    <transition name="fade" mode="out-in">
      <h2 :key="t.lang">
        {{ t.title }}<br />
        💍💒
      </h2>
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
        <button :key="t.lang + '-button'" class="btn">{{ t.button }}</button>
      </transition>
    </form>

    <transition name="fade">
      <p v-if="errorMessage" class="error">⚠️ {{ errorMessage }}</p>
    </transition>

    <transition name="fade">
      <p v-if="successMessage" class="success">✅ {{ successMessage }}</p>
    </transition>
    <transition name="fade">
      <div v-if="!cookieAccepted" class="cookie-banner">
        <p>
          {{ t.cookieMessage }}
        </p>
        <button @click="acceptCookies">{{ t.cookieButton }}</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'

export default defineComponent({
  setup() {
    const enteredKunstler = ref('')
    const enteredTitel = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')
    const lang = ref('de')
    const errorTimer = ref(null)
    const cookieAccepted = ref(false)

    const translations = {
      de: {
        lang: 'de',
        title: 'Music Wünsche',
        message: 'Teile deinen Musikwunsch für unseren besonderen Tag 💕',
        artistLabel: 'Künstler/in',
        artistPlaceholder: 'Künstler name ...',
        titleLabel: 'Titel',
        titlePlaceholder: 'Musiktitel ...',
        button: 'Speichern',
        error: 'Bitte fülle beide Felder aus.',
        success: 'Dein Wunsch wurde erfolgreich gespeichert! 🎶',
        cookieMessage: 'Wir speichern keine persönlichen Daten – nur deinen Musikwunsch 💚',
        cookieButton: 'Verstanden!',
      },
      en: {
        lang: 'en',
        title: 'Music Wishes',
        message: 'Share your music request for our special day 💕',
        artistLabel: 'Artist',
        artistPlaceholder: 'Artist name ...',
        titleLabel: 'Title',
        titlePlaceholder: 'Song title ...',
        button: 'Save',
        error: 'Please fill in both fields.',
        success: 'Your wish was successfully saved! 🎶',
        cookieMessage: 'We don’t store personal data – just your music wish 💚',
        cookieButton: 'Got it!',
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

        // Clear any previous timeouts if needed
        if (errorTimer.value) clearTimeout(errorTimer.value)

        // Set a new timeout to clear the message
        errorTimer.value = setTimeout(() => {
          errorMessage.value = ''
          errorTimer.value = null
        }, 4000)

        return
      }
      const song = `${enteredKunstler.value} - ${enteredTitel.value}`
      try {
        await fetch('https://music-list-cadfa-default-rtdb.firebaseio.com/songs.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            song,
          }),
        })

        successMessage.value = t.value.success
        enteredKunstler.value = ''
        enteredTitel.value = ''

        // Clear success message after 4 seconds
        setTimeout(() => {
          successMessage.value = ''
        }, 4000)
      } catch {
        errorMessage.value =
          lang.value === 'de' ? 'Fehler beim Speichern.' : 'An error occurred while saving.'
      }
    }
    const acceptCookies = () => {
      cookieAccepted.value = true
      localStorage.setItem('cookieAccepted', 'true')
    }

    // Check on load
    onMounted(() => {
      if (localStorage.getItem('cookieAccepted') === 'true') {
        cookieAccepted.value = true
      }
    })

    return {
      enteredKunstler,
      enteredTitel,
      errorMessage,
      successMessage,
      t,
      submitPoem,
      setLanguage,
      acceptCookies,
      cookieAccepted,
    }
  },
})
</script>

<style>
@keyframes romanticBackground {
  0% {
    background-color: #f0fff0; /* honeydew */
  }
  25% {
    background-color: #e6ffe6; /* light mint */
  }
  50% {
    background-color: #f5fff5; /* very pale green */
  }
  75% {
    background-color: #d0f0c0; /* tea green */
  }
  100% {
    background-color: #f0fff0; /* back to start */
  }
}

body {
  font-family: 'Segoe UI', sans-serif;
  animation: romanticBackground 60s infinite alternate ease-in-out;
  transition: background-color 60s ease;
  padding: 2rem;
}

.container {
  max-width: 500px;
  margin: 5rem auto;
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(144, 238, 144, 0.5); /* light green glow */
  text-align: center;
}

.lang-switcher {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.lang-switcher button {
  background: none !important;
  background-color: none !important;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.lang-switcher button:hover {
  transform: scale(1.2);
}

h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2e8b57; /* sea green */
  margin-bottom: 0.5rem;
}

.wedding-message {
  font-size: 1.2rem;
  color: #006400; /* dark green */
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
  color: #006400;
  text-align: left;
}

input {
  border: 1px solid #90ee90 !important; /* light green */
  height: 3rem;
  padding-left: 1rem;
  background: #f0fff0 !important;
  border-radius: 1rem !important;
  font-size: 1rem;
}

.btn {
  border: none;
  background-color: #006400 !important; /* lime green */
  color: white !important;
  font-weight: bold !important;
  font-size: 1.2rem !important;
  height: 3rem;
  border-radius: 2rem;
  cursor: pointer;
  margin-top: 1rem;
}

.btn:hover {
  background-color: #3ee28c !important; /* minty green */
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(34, 139, 34, 0.95); /* forest green semi-transparent */
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 0.95rem;
  z-index: 999;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.cookie-banner button {
  margin-left: 1rem;
  background: white;
  color: green;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  padding: 0.4rem 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.cookie-banner button:hover {
  background: #f0fff0;
}
</style>
