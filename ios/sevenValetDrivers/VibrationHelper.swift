import Foundation
import AudioToolbox

@objc(VibrationHelper)
class VibrationHelper: NSObject {
  @objc
  func triggerVibration() {
    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
  }
}
