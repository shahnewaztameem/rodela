;(function () {
  function FlipClock(el, config) {
    var _this = this
    var updateTimeout
    _this.el = el
    _this.config = Object.assign(
      {
        endDate: new Date(new Date().getFullYear() + 0, 9, 13),
        labels: {
          days: 'Days',
          hours: 'Hours',
          minutes: 'Minutes',
          seconds: 'Seconds',
        },
      },
      config
    )

    _this.current = {
      d: '00',
      h: '00',
      m: '00',
      s: '00',
    }

    createView()
    updateView()
    addObserver()

    function start() {
      _this.current = getTimeUntil(
        config.endDate.getTime(),
        new Date().getTime()
      )
      updateView()
      clearTimeout(updateTimeout)
      updateTimeout = setTimeout(start, 500)
    }

    function stop() {
      clearTimeout(updateTimeout)
    }

    function destroy() {
      stop()
      _this.observer.disconnect()
      _this.el.innerHTML = ''
    }

    function getTimeUntil(dateFuture, dateNow) {
      var delta = Math.abs(dateFuture - dateNow) / 1000
      var d = Math.floor(delta / 86400)
      delta -= d * 86400
      var h = Math.floor(delta / 3600) % 24
      delta -= h * 3600
      var m = Math.floor(delta / 60) % 60
      delta -= m * 60
      var s = Math.floor(delta % 60)

      d = pad3(d)
      h = pad2(h)
      m = pad2(m)
      s = pad2(s)

      return {
        d: d + '',
        h: h + '',
        m: m + '',
        s: s + '',
      }
    }

    // Assumes a non-negative number.
    function pad2(number) {
      if (number < 10) return '0' + number
      else return '' + number
    }

    function pad3(number) {
      if (number < 10) return '0' + number
      else if (number < 100) return '' + number
      else return '' + number
    }

    function createView() {
      _this.daysLeaf = createLeaf(_this.config.labels.days, 3)
      _this.hoursLeaf = createLeaf(_this.config.labels.hours)
      _this.minutesLeaf = createLeaf(_this.config.labels.minutes)
      _this.secondsLeaf = createLeaf(_this.config.labels.seconds)
    }

    function createLeaf(label, digits) {
      var leaf = document.createElement('div')
      leaf.className = 'leaf _' + (digits ? digits : '2') + '-digits'
      leaf.setAttribute('data-label', label)
      var top = document.createElement('div')
      var topLabel = document.createElement('span')
      top.className = 'top'
      top.appendChild(topLabel)
      var frontLeaf = document.createElement('div')
      var frontLabel = document.createElement('span')
      frontLeaf.className = 'leaf-front'
      frontLeaf.appendChild(frontLabel)
      var backLeaf = document.createElement('div')
      var backLabel = document.createElement('span')
      backLeaf.className = 'leaf-back'
      backLeaf.appendChild(backLabel)
      var bottom = document.createElement('div')
      var bottomLabel = document.createElement('span')
      bottom.className = 'bottom'
      bottom.appendChild(bottomLabel)

      leaf.appendChild(top)
      leaf.appendChild(frontLeaf)
      leaf.appendChild(backLeaf)
      leaf.appendChild(bottom)

      _this.el.appendChild(leaf)

      return {
        el: leaf,
        topLabel: topLabel,
        frontLabel: frontLabel,
        backLabel: backLabel,
        bottomLabel: bottomLabel,
      }
    }

    function updateView() {
      updateLeaf(_this.daysLeaf, _this.current.d)
      updateLeaf(_this.hoursLeaf, _this.current.h)
      updateLeaf(_this.minutesLeaf, _this.current.m)
      updateLeaf(_this.secondsLeaf, _this.current.s)
    }

    function updateLeaf(leaf, value) {
      if (leaf.isFlipping) return

      var currentValue = leaf.topLabel.innerText
      if (value !== currentValue) {
        leaf.isFlipping = true
        leaf.topLabel.innerText = value
        leaf.backLabel.innerText = value
        leaf.el.classList.add('flip')

        clearTimeout(leaf.timeout)
        leaf.timeout = setTimeout(function () {
          leaf.frontLabel.innerText = value
          leaf.bottomLabel.innerText = value
          leaf.el.classList.remove('flip')
        }, 600)

        clearTimeout(leaf.timeout2)
        leaf.timeout2 = setTimeout(function () {
          leaf.isFlipping = false
        }, 1000)
      }
    }

    function addObserver() {
      _this.observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            start()
          } else {
            stop()
          }
        })
      })

      _this.observer.observe(_this.el)
    }

    return {
      start: start,
      stop: stop,
      destroy: destroy,
      getCurrent: function () {
        return _this.current
      },
    }
  }

  //================================================
  // Initialise the examples
  var currentYear = new Date().getFullYear()

  // FlipClock 1 Example: My Birthday
  new FlipClock(document.getElementById('flipclock-1'), {
    endDate: new Date(currentYear, 09, 13),
    labels: {
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
    },
  })
})()
