import {
  QInput,
  QSelect,
  QCheckbox,
  QToggle,
  QRadio,
  QOptionGroup,
  QDate,
  QTime,
  QFile,
  QUploader,
  QEditor,
  QSlider,
  QRange,
  QKnob,
  QField
} from 'quasar'


export const componentMap = {
  // 🔤 TEXT / INPUT
  's-input': QInput,
  'q-field': QField,

  // 🔽 SELECT / RELATIONS
  's-select': QSelect,
  'q-option-group': QOptionGroup,

  // ✅ BOOLEAN
  's-checkbox': QCheckbox,
  's-switch': QToggle,
  'q-radio': QRadio,

  // 📅 DATE / TIME
  'q-date': QDate,
  'q-time': QTime,

  // 📂 FILES
  's-upload': QFile,
  'q-uploader': QUploader,

  // ✍️ RICH TEXT
  'q-editor': QEditor,

  // 🎚 NUMERIC / RANGE
  'q-slider': QSlider,
  'q-range': QRange,
  'q-knob': QKnob,
}