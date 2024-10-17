import numpy as np

class SalgoSQZMStrategy:
    def __init__(self, length=20, mult=2.0, lengthKC=20, multKC=1.5, use_true_range=True):
        self.length = length
        self.mult = mult
        self.lengthKC = lengthKC
        self.multKC = multKC
        self.use_true_range = use_true_range
        self.is_long = False
        self.is_short = False

    def sma(self, data, window):
        return np.convolve(data, np.ones(window) / window, 'valid')

    def stdev(self, data, window):
        return np.std(data[-window:])

    def linreg(self, data, window):
        x = np.arange(len(data))
        slope, intercept = np.polyfit(x[-window:], data[-window:], 1)
        return slope * x[-1] + intercept

    def get_signals(self, high, low, close, volume):
        source = close[-1]
        basis = self.sma(close, self.length)[-1]
        dev = self.multKC * self.stdev(close, self.length)
        upper_bb = basis + dev
        lower_bb = basis - dev

        ranger = np.abs(high - low) if not self.use_true_range else np.abs(high - low).max()
        ma_kc = self.sma(close, self.lengthKC)[-1]
        range_ma = self.sma(ranger, self.lengthKC)[-1]
        upper_kc = ma_kc + range_ma * self.multKC
        lower_kc = ma_kc - range_ma * self.multKC

        sqz_on = (lower_bb > lower_kc) and (upper_bb < upper_kc)
        sqz_off = (lower_bb < lower_kc) and (upper_bb > upper_kc)
        no_sqz = not sqz_on and not sqz_off

        val = self.linreg(close - np.mean([np.max(high), np.min(low)]), self.lengthKC)
        prev_val = self.linreg(close[:-1] - np.mean([np.max(high[:-1]), np.min(low[:-1])]), self.lengthKC)

        volume_condition = (30 < volume[-1] < 1000)
        price_movement_condition = (np.abs(close[-1] - open[-1]) >= 0.01 and np.abs(close[-1] - open[-1]) <= 2)
        val_condition = np.abs(val - prev_val) > 0.015

        signals = {
            "long_entry": False,
            "long_exit": False,
            "short_entry": False,
            "short_exit": False
        }

        if not self.is_short and val > 0 and volume_condition and price_movement_condition and (close[-1] - open[-1]) <= -0.03 and val_condition:
            self.is_short = True
            self.is_long = False
            signals["short_entry"] = True

        if self.is_short and (close[-1] - open[-1]) >= 0.001:
            self.is_short = False
            signals["short_exit"] = True

        if not self.is_long and val > 0 and volume_condition and price_movement_condition and (close[-1] - open[-1]) >= 0.03 and val_condition:
            self.is_long = True
            self.is_short = False
            signals["long_entry"] = True

        if self.is_long and (close[-1] - open[-1]) <= -0.001:
            self.is_long = False
            signals["long_exit"] = True

        return signals
