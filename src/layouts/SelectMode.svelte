<!-- Начальная страница с двумя большими кнопками -->
<script>
  import { STATES } from '../constants';
  import { slide } from '../transitions';
  import {__} from '../utils/translations';
  const slideLeft = slide('left');
  const slideRight = slide('right');
</script>

<div class="layout">
  <main>
    <label class="area temp" transition:slideLeft>
      <img src="../static/icons/temperature.svg" alt="temperature" />
      <p>{$__('temperature measurement and control')}</p>
      <input type="radio" name="appState" value={STATES.temp} on:change />
    </label>
    <label class="area effects" transition:slideRight>
      <img src="../static/icons/peltier.svg" alt="temperature" />
      <p>{$__('study of peltier and seebeck effects')}</p>
      <input type="radio" name="appState" value={STATES.effects} on:change />
    </label>
  </main>
</div>

<style>
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  input {
    position: absolute;
    top: -9999px;
    left: -9999px;
    visibility: hidden;
  }
  label {
    font-size: 2.4rem;
    font-family: 'Oswald', 'Franklin Gothic Medium', 'Arial Narrow', Arial,
      sans-serif;
    color: var(--bg-color);
    width: 40rem;
    text-align: center;
    border-radius: 12px;
    padding: 3.2rem 8rem;
  }
  label img {
    width: 60%;
    display: block;
    margin: 0 auto;
  }
  .temp {
    background-color: var(--corporate-orange);
  }
  .temp img {
    position: relative;
    left: 10%;
  }
  .effects {
    background-color: var(--corporate-blue);
  }
</style>
