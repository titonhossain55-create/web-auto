import React, { useState } from 'react';
import { Car, X, Check, Wrench, Trash2, Plus, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VEHICLE_MAKES, VEHICLE_MODELS, VEHICLE_YEARS } from '../data/mockProducts';

export const VehicleSelectorModal: React.FC = () => {
  const {
    isVehicleModalOpen,
    setIsVehicleModalOpen,
    activeVehicle,
    setActiveVehicle,
    saveVehicleToGarage,
    currentUser,
    t,
  } = useApp();

  const [selectedYear, setSelectedYear] = useState<number>(activeVehicle?.year || 2024);
  const [selectedMake, setSelectedMake] = useState<string>(activeVehicle?.make || 'Toyota');
  const [selectedModel, setSelectedModel] = useState<string>(activeVehicle?.model || 'RAV4');

  if (!isVehicleModalOpen) return null;

  const availableModels = VEHICLE_MODELS[selectedMake] || ['Standard Model', 'GT Edition', 'Base'];

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    const models = VEHICLE_MODELS[make] || [];
    if (models.length > 0) {
      setSelectedModel(models[0]);
    }
  };

  const handleApply = () => {
    saveVehicleToGarage({
      make: selectedMake,
      model: selectedModel,
      year: selectedYear,
    });
    setIsVehicleModalOpen(false);
  };

  const handleClearVehicle = () => {
    setActiveVehicle(null);
    setIsVehicleModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                {t('selectVehicle')}
              </h3>
              <p className="text-xs text-neutral-400">
                Guaranteed fitment for accessories, parts, and interior upgrades
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVehicleModalOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Saved Garage Presets */}
          {currentUser.savedVehicles.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                {t('myVehicles')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentUser.savedVehicles.map((veh) => {
                  const isCurrent =
                    activeVehicle &&
                    activeVehicle.make === veh.make &&
                    activeVehicle.model === veh.model &&
                    activeVehicle.year === veh.year;
                  return (
                    <button
                      key={veh.id}
                      onClick={() => {
                        setActiveVehicle({ make: veh.make, model: veh.model, year: veh.year });
                        setIsVehicleModalOpen(false);
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-2 ring-amber-500/20'
                          : 'bg-neutral-800/60 border-neutral-700 text-neutral-200 hover:border-neutral-600'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">
                          {veh.year} {veh.make} {veh.model}
                        </div>
                        <div className="text-[10px] text-neutral-400">{veh.nickname || 'Active ride'}</div>
                      </div>
                      {isCurrent ? (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add / Choose Vehicle Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Choose Specific Make & Model
              </label>
              {activeVehicle && (
                <button
                  onClick={handleClearVehicle}
                  className="text-xs text-amber-400 font-semibold hover:underline"
                >
                  Clear Vehicle Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Year */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {t('year')}
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {VEHICLE_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Make */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {t('make')}
                </label>
                <select
                  value={selectedMake}
                  onChange={(e) => handleMakeChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {VEHICLE_MAKES.map((mk) => (
                    <option key={mk} value={mk}>
                      {mk}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {t('model')}
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {availableModels.map((mdl) => (
                    <option key={mdl} value={mdl}>
                      {mdl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Guaranteed Fit Info Box */}
            <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-300 leading-relaxed">
                When a vehicle is selected, ApexAuto automatically highlights accessories tested to match your OEM electronics, harness pinouts, and interior dimensions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-800 flex items-center justify-end gap-3 bg-neutral-950">
          <button
            onClick={() => setIsVehicleModalOpen(false)}
            className="px-4 py-2.5 text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            id="apply-vehicle-btn"
            onClick={handleApply}
            className="px-5 py-2.5 text-xs font-black text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-transform active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>{t('saveVehicle')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
